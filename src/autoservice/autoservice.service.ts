import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
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
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

interface RequestOptions {
  method: string;
  headers: any;
  body?: any;
  endpoint?: string;
}

@Injectable()
export class AutoserviceService {
  startDate
  endDate
  status: boolean;


  constructor(
    @InjectQueue('autoservice') private readonly autoserviceQueue: Queue,
    private readonly config: ConfigService,
    private readonly sqsService: SqsService,
    private readonly prisma: PrismaService,
    private readonly util: UtilService
    // //@InjectPinoLogger(AutoserviceService.name) private readonly logger: PinoLogger
    // private readonly logger = new Logger(AutoserviceService.name)
  ) { }

  @SqsMessageHandler('autoservice', false)
  async handleMessage(message: Message) {
    // console.log(this.config.get('SQS_URL'))
    // console.log(message);
    const msgBody = JSON.parse(message.Body);
    if (msgBody) {
      console.log('mensagem recebida')
      msgBody.startDate = this.startDate;
      msgBody.endDate = this.endDate;
    };
    try {
      const job = await this.autoserviceQueue.add('autoservice', msgBody, {
        delay: 2000,
        attempts: 10,
      });
    } catch (error) {
      console.log('consumer error', JSON.stringify(error));
      //this.logger.error('Erro ao processar mensagem do SQS', error);
    }
  }

  async fetch(url, params, method, endpoint = null, category = null, token = null) {
    const path = endpoint ? new URL(endpoint, url) : new URL(url);

    const requestOptions: RequestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}`} : {})
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
      await this.prisma.errorLog.create({
        data: {
          time: new Date(),
          category,
          message: error.message,
          code: error.code,
          params: JSON.stringify(params),
        }
      });
      throw error;
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

    if (startDate && endDate) {
      category = 'api-vw';
      const dates = {
        dataInicio: moment(startDate).format(this.config.get('DATE_FORMAT')),
        dataFim: moment(endDate).format(this.config.get('DATE_FORMAT')),
      }
      const apiConfig = this.config.get('api');
      const api = await this.fetch(apiConfig.url, dates, 'GET', 'findByPeriod', 'api-vw', access_token);
    } else {
      // this.start(startDate, endDate);
      throw new CustomError(
        ErrorMessages.DATE_MISSING,
        500,
        'Campos startDate e endDate não informados na chamada da api',
        category
      )
    }
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

  // extractData(data, fields) {
  //   const newData = fields.reduce((acc, field) => {
  //     if (data[field] != null && data[field] !== '') {
  //       if (field.startsWith('data_')) {
  //         acc[field] = this.convertDate(data[field]).momentFormat;
  //         // } else if (field.startsWith('valor_')) {
  //         //   acc[field] = data[field].toLocaleString('pt-BR');
  //       } else {
  //         acc[field] = data[field];
  //       }
  //     }
  //     return acc;
  //   }, {});

  //   return newData;
  // };

  async pastData(year, month, day = null) {
    let startMonth;
    if (day) {
      startMonth = moment().month(month).year(year).date(day);
    } else {
      startMonth = moment().month(month).year(year).startOf('month');
    }
    const endMonth = moment().month(month).endOf('month');
    const days = moment().month(month).daysInMonth();
    const startDay = day ?? 1;
    for (let i = startDay; i <= days; i++) {
      const date = startMonth.clone().date(i).startOf('day');
      for (let h = 0; h < 24; h++) {
        const endDate = date.clone().add(h + 1, 'hours').format('YYYY-MM-DDTHH:mm:ss');
        const startDate = date.clone().add(h, 'hours').format('YYYY-MM-DDTHH:mm:ss');
        console.info('solicitando dados retroativos: ', startDate, endDate);
        // const isActive = await this.autoserviceQueue.getActive();
        // if (!isActive) {
        // await this.getData(startDate, endDate);
        await this.getData(startDate, endDate);
        // }
        // }, 30 * 60 * 1000)
        // await new Promise(resolve => setTimeout(resolve, 30000));
        await new Promise(resolve => setTimeout(resolve, 100000));
      }
    }
  }

  async parseYear(year) {
    for (let m = 0; m <= 11; m++) {
      await this.pastData(year, m);
    }
  }

  // async retro(year, month, day, hour, status = false) {
  //   // console.log(this.getCurrentDate(1));
  //   // console.log(this.getDates(2025, 1, 23, 11))
  //   // const end = moment().month(month -1).set(day).set(hour);
  //   // const start = end.clone().subtract(1, 'hour');
  //   const date = this.getDate(2025, 1, 23, 12, 30);
  //   const endDate = this.getDate(2025, 1, 23, 13, 0);

  //   const dates = this.getDates(year, month, day, hour);
  //   const data = {
  //     endDate: endDate.date,
  //     startDate: date.date,
  //     status
  //   }
  //   console.log(date);
  //   console.log(data);
  //   const lastSearch = await this.prisma.lastSearch.upsert({
  //     where: {
  //       id: 1
  //     },
  //     create: data,
  //     update: data,
  //     select: {
  //       id: true,
  //       status: true,
  //       endDate: true,
  //       startDate: true
  //     }
  //   })

  //   const teste = await this.prisma.lastSearch.findFirst({
  //     where: {
  //       id: 1
  //     }
  //   })

  //   console.log(this.convertDate(teste.startDate));
  //   // return this.getData(end, start);
  // }

  // async updateData() {
  //   console.log('Método updateData do serviço foi chamado');
  //   try {
  //     const data = await this.prisma.findMany('ck6011', 'data_e_hora_do_fechamento_da_os', null)
  //     if (data.total > data.data.length) {
  //       console.log('maior');
  //     } else {
  //       console.log('menor');
  //     }
  //     for (const item of data.data) {
  //       const date = moment(item.data_e_hora_da_abertura_da_os);
  //       const startDate = date.clone().subtract(1, 'hour');
  //       const endDate = date.clone().add(1, 'hour');
  //       console.log(startDate.format('YYYY-MM-DDTHH:mm:ss'), endDate.format('YYYY-MM-DDTHH:mm:ss'))
  //       await this.getData(startDate.format('YYYY-MM-DDTHH:mm:ss'), endDate.format('YYYY-MM-DDTHH:mm:ss'));
  //       await new Promise(resolve => setTimeout(resolve, 60000));
  //     }
  //     // const data = await this.prisma.ck6011.findMany({
  //     //   where: {
  //     //     data_e_hora_do_fechamento_da_os: null,
  //     //   },
  //     // });
  //     console.log('Dados encontrados:', data);
  //     return 'Dados atualizados com sucesso';
  //   } catch (error) {
  //     console.error('Erro ao buscar dados:', error);
  //     throw new Error('Erro ao buscar dados');
  //   }
  // }

  // getDate(
  //   year: number,
  //   month: number,
  //   day: number,
  //   hour = 1,
  //   minutes = 0,
  //   interval = 1,
  //   unit: 'hour' | 'hours' | 'minute' | 'minutes' | 'day' | 'days' = 'hours'
  // ) {
  //   const timezone = 'America/Sao_Paulo';
  //   const date = moment({ year, month: month - 1, day, hour, minutes });
  //   const dateJs = new Date();
  //   const tz = dateJs.getTimezoneOffset() / -60;

  //   return {
  //     now: moment().format(),
  //     nowJs: dateJs,
  //     nowJsString: Date(),
  //     nowEpochMillis: dateJs.getTime(),
  //     nowEpchSecs: Math.floor(dateJs.getTime() / 1000),
  //     tzOffset: dateJs.getTimezoneOffset(),
  //     tz,
  //     nowDateBr: dateJs.toLocaleDateString(),
  //     nowTimeBr: dateJs.toLocaleTimeString(),
  //     momentUtc: moment().utc().format(),
  //     moment: date,
  //     date: date.format(),
  //     dateJs: new Date(year, month, hour, minutes, 0),
  //     timestamp: date.format('YYYY-MM-DDTHH:mm:ss'),
  //     timestampz: date.format(),
  //     timestampzFixed: date.subtract('hour', 3).format(),
  //     epoch: date.unix(),
  //     epochSecs: date.valueOf(),
  //     day: date.date(),
  //     dayOfWeek: date.day(),
  //     dayOfWeekStr: date.weekday(),
  //     dayOfYear: date.dayOfYear(),
  //     daysInMonth: date.daysInMonth(),
  //     month: date.month(),
  //     monthParsed: date.month() + 1,
  //     year: date.year(),
  //     hour: date.hour(),
  //     minutes: date.minute()
  //   };
  // }


  // getDates(
  //   year: number,
  //   month: number,
  //   day: number,
  //   hour = 1,
  //   minutes = 0,
  //   interval = 1,
  //   unit: 'hour' | 'hours' | 'minute' | 'minutes' | 'day' | 'days' = 'hours'
  // ) {
  //   //'YYYY-MM-DDThh:mm:ss'
  //   const endDate = moment({ year, month: month - 1, day })
  //     .hour(hour)
  //     .minutes(minutes)
  //   const startDate = moment(endDate).subtract(interval, unit).format();
  //   return { endDate: endDate.format(), startDate };
  // }

  // getToken() {
  //   return fetch(this.config.get('TOKEN_URL'), {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       client_id: this.config.get('API_ID'),
  //       client_secret: this.config.get('API_SECRET'),
  //       grant_type: 'client_credentials',
  //     })
  //   })
  //     .then(async response => {
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(`Error ${response.status}: ${errorData.error_description || errorData.error || 'Unknown error'}`);
  //       }
  //       return response.json();
  //     })
  //     // .then(data => {
  //     //   console.log("Token obtained:", data.access_token);
  //     // })
  //     .catch(async (error) => {
  //       console.error("Falha ao obter token do Autoservice:", error.message);
  //       // await this.prisma.errorLog.create({
  //       //   data: {
  //       //     category: "vw-token",
  //       //     message: error.message,
  //       //     code: error.code,
  //       //     startDate: this.startDate,
  //       //     endDate: this.endDate
  //       //   }
  //       // })
  //       //this.logger.error('Erro ao obter token', error);
  //     });
  // }

  // async getData(dataInicio = null, dataFim = null) {
  //   if (!this.status) {
  //     console.log("⏳ Aguardando 30 segundos antes de tentar novamente...");
  //     await new Promise(resolve => setTimeout(resolve, 30000));
  //   }
  //   let token, url;

  //   url = new URL('findByPer', this.config.get('API_URL'));

  //   if (dataInicio && dataFim) {
  //     this.startDate = dataInicio;
  //     this.endDate = dataFim;
  //   } else {
  //     const date = this.getCurrentDate(1);
  //     this.startDate = date.startDateShort;
  //     this.endDate = date.endDateShort;
  //   }

  //   console.log('Solicitado dados para o intervalo entre:', this.startDate, this.endDate);
  //   url.searchParams.append('dataInicio', this.startDate);
  //   url.searchParams.append('dataFim', this.endDate);

  //   while (true) {
  //     try {
  //       token = await this.getToken();

  //       const response = await fetch(url, {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${token.access_token}`
  //         }
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(`Error ${response.status}: ${errorData.error_description || errorData.error || 'Unknown error'}`);
  //       }

  //       const data = await response.json();
  //       console.log("✅ Dados solicitados com sucesso:", data);
  //       this.status = true;
  //       return data;

  //     } catch (error) {
  //       const code = 500;
  //       const cause = ServiceUnavailableException;
  //       const category = 'api-autoservice-vw';
  //       const startDate = this.startDate;
  //       const endDate = this.endDate;
  //       this.status = false;
  //       throw new CustomError(error.message, code, cause, category, startDate, endDate);
  //       // continue;
  //     } finally {
  //       if (this.status) {
  //         continue;
  //       } else {
  //         this.getData(this.startDate, this.endDate);
  //       }
  //     }
  //   }
  // }


  // async getData(dataInicio = null, dataFim = null) {
  //   let token, url;

  //   url = new URL('findByPer', this.config.get('API_URL'));
  //   // url.searchParams.append('dataInicio', '2025-01-02T00:41:37');
  //   // url.searchParams.append('dataFim', '2025-01-03T23:41:37');
  //   if (dataInicio && dataFim) {
  //     this.startDate = dataInicio;
  //     this.endDate = dataFim;
  //   } else {
  //     const date = this.getCurrentDate(1);
  //     this.startDate = date.startDateShort;
  //     this.endDate = date.endDateShort;
  //   }
  //   console.log('solicitado dados para o intervalo entre: ', this.startDate, this.endDate);
  //   url.searchParams.append('dataInicio', this.startDate);
  //   url.searchParams.append('dataFim', this.endDate);
  //   token = await this.getToken();

  //   return await fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${token.access_token}`
  //     }
  //   })
  //     .then(async response => {
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(`Error ${response.status}: ${errorData.error_description || errorData.error || 'Unknown error'}`);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log("Dados solicitados", data);
  //     })
  //     .catch(error => {
  //       console.error("Falha ao obter dados do Autoservice: ", error.message);
  //       setInterval(() => this.getData(), 30000);
  //       // await this.prisma.errorLog.create({
  //       //   data: {
  //       //     category: "vw-api",
  //       //     message: error.message,
  //       //     code: error.code,
  //       //     startDate: this.startDate,
  //       //     endDate: this.endDate
  //       //   }
  //       // })
  //     });
  // }
}
