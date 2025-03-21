import { Inject, Injectable, Logger, LoggerService, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { Message } from "@aws-sdk/client-sqs";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as moment from 'moment';
import { CustomError } from '../common/errors/custom-error';
import { ErrorMessages } from '../common/errors/messages';
import { UtilService } from '../util/util.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { last } from 'rxjs';
import { Interval } from '@nestjs/schedule';

interface RequestOptions {
  method: string;
  headers: any;
  body?: any;
  endpoint?: string;
}

@Injectable()
export class AutoserviceService implements OnModuleInit {
  startDate
  endDate
  status: boolean;
  isBusy: boolean;

  constructor(
    @InjectQueue('autoservice') private readonly autoserviceQueue: Queue,
    private readonly config: ConfigService,
    private readonly sqsService: SqsService,
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async onModuleInit() {
    this.isBusy = false;
    this.autoserviceQueue.drain();
    await Promise.all([
      this.startProcess(2024, 2),
      this.startProcess(2025, 2),
    ]);
  }

  @Interval(60000)
  testeInterval() {
    this.checkQueue();
  }

  @OnEvent('autoservice.*')
  handleOrderEvents(payload) {
    console.log(payload);
  }

  @OnEvent('autoservice.working')
  handleWorking(payload) {
    this.isBusy = true;
  }

  @OnEvent('autoservice.complete')
  handleComplete(payload) {
    console.log('fila concluida', payload);
    this.isBusy = false;
  }

  setLog(level: string, message: string, error: string, startDate?: string | Date, endDate?: string | Date) {
    return Logger[level](`message: ${message} \nErro: ${error} \nStartDate: ${startDate}, EndDate: ${endDate}`);
  }

  @SqsMessageHandler('autoservice', false)
  async handleMessage(message: Message) {
    const msgBody = JSON.parse(message.Body);
    if (msgBody) {
      console.log('mensagem recebida', this.startDate, this.endDate);
      msgBody.startDate = this.startDate;
      msgBody.endDate = this.endDate;
    };
    try {
      const job = await this.autoserviceQueue.add('autoservice', msgBody, {
        delay: 5000,
        attempts: 10,
        backoff: 3,
        removeOnComplete: true
      });
    } catch (error) {
      console.error('consumer error', JSON.stringify(error));
      await this.setLog('error', 'Erro ao processar mensagem do SQS', error.message, this.startDate, this.endDate);
    }
  }

  async getSqsStatus(): Promise<boolean> {
    try {
      const consumerStatus = await this.sqsService.consumers.get('autoservice').instance.status;
      return consumerStatus.isPolling && consumerStatus.isRunning;
    } catch (error) {
      this.setLog('error', 'Não foi possível verificar o status do SQS', error.message, this.startDate, this.endDate);
      return false;
    }
  }


  async fetch(url, params, method, endpoint = null, category = null, token = null) {
    const path = endpoint ? new URL(endpoint, url) : new URL(url);

    const requestOptions: RequestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    };

    if (params) {
      if (method == 'POST') {
        requestOptions.body = JSON.stringify(params);
      } else if (method == 'GET') {
        Object.entries(params).forEach(([key, value]: [string, any]) => {
          path.searchParams.append(key, value);
        });
      }
    }

    const request = new Request(path, requestOptions);

    return fetch(request)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(async (error) => {
        await this.prisma.logError({
          category,
          message: error.message,
          code: error.code,
          params: JSON.stringify(params),
        });
      });
  }

  async getData(startDate = null, endDate = null) {
    let category = 'token';
    const tokenConfig = this.config.get('token');
    const tokenParams = {
      client_id: tokenConfig.appId,
      client_secret: tokenConfig.appSecret,
      grant_type: 'client_credentials',
    }
    const { access_token } = await this.fetch(tokenConfig.url, tokenParams, 'POST', null, category);
    if (!access_token) {
      await this.prisma.logError({
        category: 'ck7003',
        message: 'Não foi possível obter token',
        code: '500',
        params: tokenParams,
      });
    }
    try {
      if (startDate && endDate) {
        category = 'api-vw';
        const dates = {
          dataInicio: moment(startDate).format(this.config.get('DATE_FORMAT')),
          dataFim: moment(endDate).format(this.config.get('DATE_FORMAT')),
        }
        const apiConfig = this.config.get('api');
        const api = await this.fetch(apiConfig.url, dates, 'GET', 'findByPeriod', 'api-vw', access_token);
        await this.saveLastSearch(startDate, endDate);
        Logger.debug(`Processando dados no dia ${dates.dataInicio} - ${dates.dataFim}`);
      } else {
        await this.prisma.logError({
          category: 'ck7003',
          message: 'Campos de datas não informados',
          code: '500',
          params: { startDate, endDate },
        });
      }
    } catch (error) {
      setTimeout(() => {
        this.setLog('error', 'Erro ao solicitar dados da API da VW', error.message, this.startDate, this.endDate);
        console.error('Falha ao acessar API, aguardando para tentar novamente...');
        this.isBusy = true;
        this.getData(startDate, endDate);
      }, 60000);
    }
  }

  async saveLastSearch(startDate, endDate) {
    return this.prisma.lastSearch.upsert({
      where: { id: 1 },
      create: {
        id: 1, startDate, endDate
      },
      update: { startDate, endDate }
    });
  }

  async getLastSearch() {
    return this.prisma.lastSearch.findFirst({
      where: { id: 1 }
    });
  }

  async saveLastParams(data) {
    return this.prisma.lastParams.upsert({
      where: { year: parseInt(data.year) },
      create: data,
      update: data
    });
  }

  async getLastParams(year) {
    return this.prisma.lastParams.findFirst({
      where: { year }
    });
  }

  async clearLastParam(year) {
    return this.prisma.lastParams.delete({
      where: { year }
    });
  }

  async changeStatusLastParam(year) {
    return this.prisma.lastParams.update({
      where: { year },
      data: { status: true }
    });
  }

  // async checkQueueStatus() {
  //   const activeJobs = await this.autoserviceQueue.getActiveCount();
  //   const waitingJobs = await this.autoserviceQueue.getWaitingCount();

  //   console.log(`Jobs Ativos: ${activeJobs}, Jobs Aguardando: ${waitingJobs}`);

  //   if (activeJobs === 0 && waitingJobs === 0) {
  //     console.log('Fila está vazia! Executando ação...');
  //   }
  // }

  // async pastData(year, month, day = null) {
  //   const lastSearch = await this.getLastSearch();
  //   if (lastSearch) {
  //     const date = moment(lastSearch.startDate);
  //     console.log(date);
  //   }
  //   let startMonth;
  //   if (day) {
  //     startMonth = moment().month(month).year(year).date(day);
  //   } else {
  //     startMonth = moment().month(month).year(year).startOf('month');
  //   }
  //   const endMonth = moment().month(month).endOf('month');
  //   const days = moment().month(month).daysInMonth();
  //   const startDay = day ?? 1;
  // for (let i = startDay; i <= days; i++) {
  //   const date = startMonth.clone().date(i).startOf('day');
  //   for (let h = 0; h < 24; h++) {
  //     const endDate = date.clone().add(h + 1, 'hours').format('YYYY-MM-DDTHH:mm:ss');
  //     const startDate = date.clone().add(h, 'hours').format('YYYY-MM-DDTHH:mm:ss');
  //     this.startDate = startDate;
  //     this.endDate = endDate;
  //     console.info('solicitando dados retroativos: ', startDate, endDate, 'estado da fila:', this.isBusy);

  //     while (this.isBusy == true) {
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //     }

  //     await this.getData(startDate, endDate);

  //     await new Promise(resolve => setTimeout(resolve, 3000));
  //   }
  // }
  // }

  async startProcess(year = 2024, month = 0, day = 1, hour = 0, minutes = 0, interval = 1) {
    const data = { year, month, day, hour, minutes, interval };

    const lastParams = await this.getLastParams(year);

    if (lastParams) {
      if (lastParams.status === true) return;
      const date1 = this.util.setDate(year, month, day, hour, minutes);
      const date2 = this.util.setDate(lastParams.year, lastParams.month, lastParams.day, lastParams.hour);
      // const date1 = moment().year(year).month(month).date(day).hour(hour).minute(minutes).seconds(0);
      // const date2 = moment().year(lastParams.year).month(lastParams.month).date(lastParams.day).hour(lastParams.hour).minute(0).seconds(0);

      if (date2.isAfter(date1)) {
        data.year = lastParams.year;
        data.month = lastParams.month;
        data.day = lastParams.day;
        data.hour = lastParams.hour;
        data.minutes = minutes;
        data.interval = interval;
      }
    }
    return this.parseYearMoment(data);
    // return this.parseYear(data);
  }

  async parseYear(data) {
    console.log('Iniciando o ano:', data.year);
    for (let m = data.month; m <= 11; m++) {
      data.month = m;
      await this.parseMonth(data);
    }
  }

  async parseMonth(data) {
    const days = moment(`${data.year}-${data.month}`, "YYYY-MM").daysInMonth();
    for (let d = data.day; d <= days; d++) {
      data.day = d;
      await this.parseDay(data);
    }
  }

  async parseDay(data) {
    const { year, month, day, hour, minutes, interval } = data;
    // const date = moment(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    // const endOfDay = moment(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`).endOf('day');
    const date = this.util.setDate(year, month, day, hour, minutes);
    const endOfDay = this.util.setEndDate(year, month, day);
    while (date.isSameOrBefore(endOfDay)) {
      await this.requestData(date, interval);
      if (this.util.isLastHourOfYear(date)) {
        this.clearLastParam(year);
        return;
      }
      date.add(interval, 'hour');
    }
  }

  async parseYearMoment(data) {
    let initialDate = moment()
      .year(data.year)
      .month(data.month)
      .date(data.day)
      .hours(data.hour)
      .minute(data.minutes)
      .second(0);
    let finalDate = moment().year(data.year).endOf('year');
    let today = moment();
    for (let day = initialDate.clone(); day.isBefore(finalDate); day.add(1, 'days')) {
      for await (let hour of Array.from({ length: 24 }, (_, i) => i).filter(h => h % data.interval === 0)) {
        let currentTime = day.clone().hour(hour).minute(0).second(0).millisecond(0);
        if (currentTime.isBefore(today)) {
          await this.requestData(currentTime, data.interval);
        } else {
          return;
        }
        if (this.util.isLastHourOfYear(currentTime)) {
          this.changeStatusLastParam(data.year);
          return;
        }
        // console.log(`Teste: Dia ${currentTime.format('YYYY-MM-DD')} Hora ${currentTime.format('HH:mm')}`);
      }
    }
  }

  async requestData(date, interval) {
    const startDate = moment(date).format("YYYY-MM-DDTHH:mm:ss");
    const endDate = moment(date).add(interval, 'hour').format("YYYY-MM-DDTHH:mm:ss");
    console.info('Solicitando dados retroativos: ', startDate, endDate, 'Estado da fila do BullMQ:', this.isBusy);

    this.startDate = startDate;
    this.endDate = endDate;

    const data = {
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      hour: date.hour()
    };

    await this.saveLastParams(data);
    await this.util.remainingDays(startDate);

    const sqsStatus = await this.getSqsStatus();
    while (sqsStatus) {
      await this.util.timer(3, "SQS ainda processando mensagens...");
    }

    while (this.isBusy) {
      await this.checkQueue();
      await this.util.timer(3, "Fila do BullMQ ocupada, aguardando...");
    }

    await this.getData(startDate, endDate);

    await this.util.timer(10, "Aguardando para próxima chamada na API...");

    return;
  }


  async handleQueue() {
    const isPaused = await this.autoserviceQueue.isPaused();
    if (isPaused) {
      await this.autoserviceQueue.resume();
      if (!(await this.autoserviceQueue.isPaused())) {
        return true;
      }
    } else {
      await this.autoserviceQueue.pause();
      if (await this.autoserviceQueue.isPaused()) {
        return false;
      }
    }
    return isPaused;
  }

  async checkQueue() {
    try {
      const activeCount = await this.autoserviceQueue.getActiveCount();
      const waitingCount = await this.autoserviceQueue.getWaitingCount();

      if (activeCount === 0 && waitingCount === 0) {
        console.warn(`Nenhuma tarefa ativa. Pausando a fila...`);
        const wasPaused = await this.handleQueue();  // Usando handleQueue para pausar
        if (wasPaused !== false) {
          this.isBusy = false;
        }
      } else {
        const wasResumed = await this.handleQueue();  // Usando handleQueue para retomar
        if (activeCount === 0) {
          if (wasResumed === true) {
            await this.autoserviceQueue.pause();
          }
        }
        console.log(`Fila ativa: ${activeCount} tarefas em execução.`);
      }
    } catch (error) {
      console.error('Erro ao verificar a fila:', error);
    }
    return;
  }


  async getClients(page = 1) {
    const [results, total] = await this.prisma.$transaction([
      this.prisma.clientes_view.findMany({
        skip: (page - 1) * 50,
        take: 50
      }),
      this.prisma.clientes_view.count()
    ]);
    return {
      results,
      total,
      page
    };
  }

  async getNfs(page = 1) {
    const [results, total] = await this.prisma.$transaction([
      this.prisma.nf_view.findMany({
        skip: (page - 1) * 50,
        take: 50
      }),
      this.prisma.nf_view.count()
    ]);
    return {
      results,
      total,
      page
    };
  }

  async getPecas(page = 1) {
    const [results, total] = await this.prisma.$transaction([
      this.prisma.nf_view.findMany({
        skip: (page - 1) * 50,
        take: 50
      }),
      this.prisma.nf_view.count()
    ]);
    return {
      results,
      total,
      page
    };
  }

  async getServicos(page = 1, year: number = 2024, month: number = 1) {
    const whereCondition: any = {};
    console.log(year);
    if (year) {
      whereCondition.data_e_hora_da_abertura_da_os = {
        gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`)
      }
    }

    const [results, total] = await this.prisma.$transaction([
      this.prisma.servicos_view.findMany({
        skip: (page - 1) * 50,
        take: 50,
        where: whereCondition
      }),
      this.prisma.servicos_view.count()
    ]);

    return {
      results,
      total,
      page
    };
  }

  setYarMonth(year, month) {
    const date = `${year}-${month}`;
    const days = moment(date).daysInMonth();
  }

  async getServicosYear(year: number = 2024) {
    const startDate = moment(year).startOf('year').toDate();
    const endDate = moment(year).endOf('year').toDate();

    const monthlyCount = await this.prisma.$queryRaw<{ month: number; total: number }[]>`
      SELECT
        EXTRACT(MONTH FROM data_e_hora_da_abertura_da_os) AS month,
        COUNT(id) AS total
      FROM servicos_view
      WHERE data_e_hora_da_abertura_da_os >= ${startDate}
        AND data_e_hora_da_abertura_da_os < ${endDate}
      GROUP BY month
      ORDER BY month;
    `;

    const monthlyData = monthlyCount.reduce((acc: { [key: number]: number }, curr: { month: number; total: number }) => {
      acc[curr.month] = curr.total;
      return acc;
    }, {});

    const total = await this.prisma.servicos_view.count({
      where: {
        data_e_hora_da_abertura_da_os: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    return {
      total,
      monthly: monthlyData
    };
  }

  async getServicosMonth(year: number = 2024, month: number = 1) {
    const date = `${year}-${month.toString().padStart(2, '0')}`;
    const startDate = moment(date).startOf('month').format();
    const endDate = moment(date).endOf('month').format();

    const whereCondition: any = {
      data_e_hora_da_abertura_da_os: {
        gte: new Date(startDate),
        lt: new Date(endDate)
      }
    };

    const [total, daily] = await this.prisma.$transaction([
      this.prisma.servicos_view.count({
        where: whereCondition
      }),
      this.prisma.$queryRaw`
            SELECT
                EXTRACT(DAY FROM data_e_hora_da_abertura_da_os) AS day,
                COUNT(id) AS total
            FROM servicos_view
            WHERE data_e_hora_da_abertura_da_os >= ${whereCondition.data_e_hora_da_abertura_da_os.gte}
            AND data_e_hora_da_abertura_da_os < ${whereCondition.data_e_hora_da_abertura_da_os.lt}
            GROUP BY day
            ORDER BY day ASC;
        `
    ]);

    return {
      total,
      daily: (daily as { day: number; total: number }[]).reduce((acc, { day, total }) => {
        acc[day] = total;
        return acc;
      }, {} as Record<number, number>)
    };
  }

  async getServicesStateMonth(year: number = 2024, month: number = 1) {
    const date = `${year}-${month.toString().padStart(2, '0')}`;
    const startDate = moment(date).startOf('month').format();
    const endDate = moment(date).endOf('month').format();

    const whereCondition: any = {
      data_e_hora_da_abertura_da_os: {
        gte: new Date(startDate),
        lt: new Date(endDate)
      }
    };

    return this.prisma.servicos_view.groupBy({
      by: ['uf'],
      where: whereCondition,
      _count: {
        id: true
      }
    });
  }

  async getServicesStateYear(year: number = 2024) {
    const startDate = moment(`${year}`).startOf('year').toDate();
    const endDate = moment(`${year}`).endOf('year').toDate();

    console.log(year, startDate, endDate);

    const whereCondition: any = {
      data_e_hora_da_abertura_da_os: {
        gte: new Date(startDate),
        lt: new Date(endDate)
      }
    };


    return this.prisma.servicos_view.groupBy({
      by: ['uf'],
      where: whereCondition,
      _count: {
        id: true
      }
    });
  }

  create(createAutoserviceDto: CreateAutoserviceDto) {
    this.util.delay(30000);
    return 'This action adds a new autoservice';
  }

  async findAll(table: string, skip: number = 1, take: number = 50) {
    const total = await this.prisma.count(table);
    const data = await this.prisma.findAll(table, (skip - 1), take);
    console.log(data);
    return {
      total,
      take,
      page: skip,
      data
    };
  }

  async findMany(table: string, field: string, value: number | string | boolean | null, skip: number = 1, take: number = 50) {
    const total = await this.prisma.countFilter(table, field, value);
    const data = await this.prisma.findMany(table, field, value, (skip - 1), take);
    return {
      total,
      take,
      page: skip,
      data
    };
  }
}
