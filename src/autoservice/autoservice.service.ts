import { BadRequestException, Inject, Injectable, Logger, LoggerService, OnApplicationBootstrap, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '../util/util.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { catchError, firstValueFrom, last, retry, startWith, throwError, timer } from 'rxjs';
import { Interval } from '@nestjs/schedule';
import { LazyModuleLoader } from '@nestjs/core';
import { DateService } from '../util/date.service';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { LogService } from './log.service';
import { QueueService } from './queue.service';
import { SqsConsumer } from './sqs.consumer';

interface RequestOptions {
  method: string;
  headers: any;
  body?: any;
  endpoint?: string;
}

interface TokenBody {
  client_id: string;
  client_secret: string;
  grant_type: string;
}

@Injectable()
export class AutoserviceService implements OnModuleInit {
  startDate: string;
  endDate: string;

  constructor(
    private lazyModuleLoader: LazyModuleLoader,
    private readonly config: ConfigService,
    private readonly util: UtilService,
    private readonly eventEmitter: EventEmitter2,
    private readonly dates: DateService,
    private readonly httpService: HttpService,
    private readonly log: LogService,
    private readonly queue: QueueService,
    private readonly sqs: SqsConsumer
  ) { }

  // @OnEvent('*')
  // testEvent(payload) { console.log(payload); }

  @OnEvent('updateDates')
  updateDates(payload) {
    const { startDate, endDate } = payload;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  // async onApplicationBootstrap() {
  async onModuleInit() {
    try {
      // await Promise.all([
      // await this.dates.processYear(2024, 6, this.main),
      // await this.dates.processYear(2025, 0, this.main),
      // this.startProcess(2025, 0),
      await this.init(2024, 6),
        // this.startProcess(2024, 0),
        // ]);

        console.debug('Processos concluídos');
    } catch (error) {
      console.error('Erro durante onApplicationBootstrap:', error);
    }
  }

  @Interval(10000)
  async checkSqs() {
    console.debug('checando status do sqs');
    return this.sqs.isSqsActiveAndEmpty();
  }

  async getToken() {
    const { client_id, client_secret, url } = this.config.get('token');;
    const body: TokenBody = {
      client_id,
      client_secret,
      grant_type: 'client_credentials'
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error obtaining access token');
    }
  }

  // async makeRequest(access_token: string, dataInicio: string, dataFim: string) {
  //   console.log('Solicitando dados retroativos:', dataInicio);
  //   try {
  //     // if (!access_token) throw new BadRequestException('Access Token não informado');
  //     // if (!dataInicio || !dataFim) throw new BadRequestException('Datas de início e fim não informadas');
  //     const { url, endpoint } = this.config.get('api');
  //     const apiUrl = `${url}/${endpoint}`;
  //     const response = await firstValueFrom(
  //       this.httpService.get(apiUrl, {
  //         params: { dataInicio, dataFim },
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }).pipe(
  //         retry({
  //           count: Infinity,
  //           delay: 30000,
  //         }),
  //         catchError((error: AxiosError) => {
  //           console.log('Error:', error.message);
  //           this.log.setLog(
  //             'error',
  //             'Falha ao solicitar dados da API Autoservice',
  //             error.message,
  //             dataInicio,
  //             dataFim
  //           );
  //           throw new BadRequestException('Falha ao solicitar dados da API Autoservice');
  //         }),
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error('Error obtaining access token: ' + error.message);
  //   }
  // }

  async makeRequest(access_token: string, dataInicio: string, dataFim: string) {
    console.log('Solicitando dados retroativos:', dataInicio);

    try {
      if (!access_token) throw new BadRequestException('Access Token não informado');
      if (!dataInicio || !dataFim) throw new BadRequestException('Datas de início e fim não informadas');
      console.log(access_token);
      const { url, endpoint } = this.config.get('api');
      // const params = this.util.jsonToUrlParams({ dataInicio, dataFim });
      // const apiUrl = `${url}/${endpoint}?${params}`;
      const apiUrl = `${url}/${endpoint}`;
      console.log('url da api:', apiUrl, url, endpoint, dataFim, dataInicio);
      let attempt = 0; // Contador de tentativas

      const response = await firstValueFrom(
        this.httpService.get(apiUrl, {
          params: { dataInicio, dataFim },
          headers: { Authorization: `Bearer ${access_token}` },
        }).pipe(
          retry({
            count: Infinity, // Tentará indefinidamente
            delay: (error, retryCount) => {
              attempt = retryCount;
              console.warn(`Tentativa ${attempt}: API falhou. Retentando em 30s...`);
              // console.error(error);
              // Logar um alerta após um número alto de tentativas
              if (attempt % 100 === 0) {
                console.error(`⚠️ Atenção: ${attempt} tentativas falharam. Verifique a API.`);
                this.log.setLog(
                  'error',
                  `⚠️ ${attempt} tentativas falharam ao solicitar dados da API Autoservice`,
                  error.message,
                  dataInicio,
                  dataFim
                );
              }

              return timer(30000);
            },
          }),
          catchError((error: AxiosError) => {
            console.error('Erro crítico na API:', error.message);
            this.log.setLog(
              'error',
              'Falha ao solicitar dados da API Autoservice',
              error.message,
              dataInicio,
              dataFim
            );
            return throwError(() => new BadRequestException('Falha ao solicitar dados da API Autoservice'));
          }),
        )
      );

      console.log('Solicitação bem-sucedida após', attempt, 'tentativas.');
      return response.data;

    } catch (error) {
      console.error('Erro inesperado na solicitação:', error);
      throw new BadRequestException('Erro ao obter os dados: ' + error.message);
    }
  }


  async mainProcess(startDate, endDate) {
    console.debug('Processando fila', startDate, endDate);
    console.log('Ouvintes registrados para sqsEmpty:', this.eventEmitter.listeners('sqsEmpty'));
    try {
      // while (!this.sqsEmpty) {
      //   console.log("SQS ainda processando mensagens...");
      //   await this.util.timer(3, "Aguardando SQS processar mensagens...");
      // }

      // while (this.isBusy) {
      //   await this.queuecheckQueue();
      //   await this.util.timer(3, "Fila do BullMQ ocupada, aguardando...");
      // }
      // Verifica se o SQS já está vazio
      // const sqsStatus = await this.sqs.getSqsStatus();
      // console.log('SQS Status:', sqsStatus);
      // if (sqsStatus === true) {
      //   // SQS já está vazio, prosseguir diretamente
      // } else {
      //   // Aguardar o evento sqsEmpty
      //   await this.eventEmitter.waitFor('sqsEmpty');
      // }

      const { access_token } = await this.getToken();
      if (!access_token) {
        throw new Error('Falha ao obter token de acesso');
      }

      this.startDate = startDate;
      this.endDate = endDate;
      const dateObj = this.dates.getDateObject(startDate);
      const { day, hour, month, year } = dateObj;
      await this.log.saveLastParams({ day, hour, month, year });
      await this.makeRequest(access_token, startDate, endDate);
    } catch (error) {
      this.log.setLog('error', 'Falha ao solicitar dados da API do autoservice', error.message);
    }
  }

  public async init(
    year: number = 2024,
    month: number = 0,
    day: number = 1,
    hour: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    interval = 1) {
    const lastParams = await this.log.getLastParams(2024);
    if (lastParams) {
      const { day: lastDay, hour: lastHour, month: lastMonth, year: lastYear } = lastParams;
      // if (year === lastYear && month === lastMonth && day === lastDay && hour === lastHour) {
      //   return;
      // }
      if (
        lastYear < year ||
        (lastYear === year && lastMonth < month) ||
        (lastYear === year && lastMonth === month && lastDay < day) ||
        (lastYear === year && lastMonth === month && lastDay === day && lastHour < hour)
      ) {
        return this.processCompleteTimestamp(lastYear, Math.max(0, lastMonth - 1), lastDay, lastHour, minutes, seconds, this.mainProcess.bind(this));
      }
      // if (lastYear <= year && lastMonth <= month && lastDay <= day && lastHour <= hour) {
      //   return this.processCompleteTimestamp(lastYear, Math.max(0, lastMonth - 1), lastDay, lastHour, minutes, seconds, this.mainProcess.bind(this));
      // }
    }
    // return this.dates.processCompleteTimestamp(year, month, day, hour, minutes, seconds, this.sendJob.bind(this));
    return this.processCompleteTimestamp(year, month, day, hour, minutes, seconds);
  }

  async sendJob(startDate, endDate) {
    try {
      if (await this.queue.jobAlreadyAdded('mainJobs', { startDate, endDate })) return;
      const job = await this.queue.addJobsToQueue('mainJobs', { startDate, endDate });
      console.log('Job enviado para a fila mainjobs:', job.id, startDate);
      return job;
    } catch (error) {
      throw new Error('Error sending job to queue: ' + error.message);
    }
  }

  public async processCompleteTimestamp(
    year: number = 2024,
    month: number = 0,
    day: number = 1,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    callback?
  ) {
    console.log('Processando timestamp:', year, month, day, hours, minutes, seconds);
    let date = Date.UTC(year, month, day, hours, minutes, seconds);
    const finalDate = Date.UTC(year, 11, 31, 23, 59, 59);
    // let date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    // const finalDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // Final de 31 de Dezembro de 2024
    const oneHour = 60 * 60 * 1000;
    console.log('Ouvintes registrados para sqsEmpty2:', this.eventEmitter.listeners('sqsEmpty'));
    while (date <= finalDate) {
      if (!this.dates.isDateValid(date)) date = this.dates.addDays(date, 1);

      console.log('teste de data: ', date,)
      console.log('Ouvintes registrados para sqsEmpty3:', this.eventEmitter.listeners('sqsEmpty'));
      // await this.eventEmitter.waitFor('sqsEmpty').then(async (data) => {
      //   console.log('evento esperado recebido no while');
      //   const { startDate, endDate } = this.dates.timestampToDates(date);
      //   await this.mainProcess(startDate, endDate);
      //   date += oneHour;
      // });
      const isSqsEmpty = await this.sqs.isSqsActiveAndEmpty();

      if (isSqsEmpty) {
        const { startDate, endDate } = this.dates.timestampToDates(date.getTime());
        await this.mainProcess(startDate, endDate);
        // date += oneHour;
        date = new Date(date.getTime() + oneHour);
      } else {
        // Esperar um pouco antes de verificar novamente
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Aguardando SQS esvaziar...');
      }
    }
  }

  // async startProcess(year = 2024, month = 0, day = 1, hour = 0, minutes = 0, interval = 1) {
  //   const data = { year, month, day, hour, minutes, interval };

  //   const lastParams = await this.getLastParams(year);

  //   if (lastParams) {
  //     if (lastParams.status === true) return;
  //     const date1 = this.util.setDate(year, month, day, hour, minutes);
  //     const date2 = this.util.setDate(lastParams.year, lastParams.month, lastParams.day, lastParams.hour);
  //     // const date1 = moment().year(year).month(month).date(day).hour(hour).minute(minutes).seconds(0);
  //     // const date2 = moment().year(lastParams.year).month(lastParams.month).date(lastParams.day).hour(lastParams.hour).minute(0).seconds(0);

  //     if (date2.isAfter(date1)) {
  //       data.year = lastParams.year;
  //       data.month = lastParams.month;
  //       data.day = lastParams.day;
  //       data.hour = lastParams.hour;
  //       data.minutes = minutes;
  //       data.interval = interval;
  //     }
  //   }
  //   return this.parseYearMoment(data);
  //   // return this.parseYear(data);
  // }

  // async requestData(date, interval) {
  //   const startDate = moment(date).format("YYYY-MM-DDTHH:mm:ss");
  //   const endDate = moment(date).add(interval, 'hour').format("YYYY-MM-DDTHH:mm:ss");
  //   console.info('Solicitando dados retroativos: ', startDate, endDate, 'Estado da fila do BullMQ:', this.isBusy);

  //   this.startDate = startDate;
  //   this.endDate = endDate;

  //   const data = {
  //     year: date.year(),
  //     month: date.month() + 1,
  //     day: date.date(),
  //     hour: date.hour()
  //   };

  //   await this.saveLastParams(data);
  //   await this.util.remainingDays(startDate);

  //   while (!this.sqsEmpty) {
  //     console.log("SQS ainda processando mensagens...");
  //     await this.util.timer(3, "Aguardando SQS processar mensagens...");
  //   }

  //   while (this.isBusy) {
  //     await this.checkQueue();
  //     await this.util.timer(3, "Fila do BullMQ ocupada, aguardando...");
  //   }

  //   await this.getData(startDate, endDate);

  //   await this.util.timer(5, "Aguardando para próxima chamada na API...");

  //   return;
  // }
}
