import { Inject, Injectable } from '@nestjs/common';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { Message } from "@aws-sdk/client-sqs";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AllExceptionsFilter } from '../all.exceptions';
import * as moment from 'moment';
@Injectable()
export class AutoserviceService {
  constructor(
    @InjectQueue('autoservice') private readonly autoserviceQueue: Queue,
    private readonly config: ConfigService,
    private readonly sqsService: SqsService,
    private readonly prisma: PrismaService
  ) { }

  @SqsMessageHandler('autoservice', false)
  async handleMessage(message: Message) {
    // console.log(this.config.get('SQS_URL'))
    // console.log(message);
    const msgBody = JSON.parse(message.Body);
    if (msgBody) console.log('mensagem recebida');
    try {
      const job = await this.autoserviceQueue.add('autoservice', msgBody, {
        delay: 2000,
        attempts: 10,
      });
    } catch (error) {
      console.log('consumer error', JSON.stringify(error));
    }
  }

  // getCurrentDate(hoursToSubtract = 0) {
  //   const now = new Date();

  //   if (typeof hoursToSubtract === 'number') {
  //     now.setHours(now.getHours() - hoursToSubtract);
  //   }

  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, '0');
  //   const day = String(now.getDate()).padStart(2, '0');
  //   const hours = String(now.getHours()).padStart(2, '0');
  //   const minutes = String(now.getMinutes()).padStart(2, '0');
  //   const seconds = String(now.getSeconds()).padStart(2, '0');

  //   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  // }
  getCurrentDate(interval: number) {
    const date = moment();
    const endDate = date.format();
    const startDate = date.subtract(interval, 'hours').format();
    return {
      endDate,
      startDate,
      endDateShort: date.format('YYYY-MM-DDTHH:mm:ss'),
      startDateShort: date.subtract(interval, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
    }
  }

  convertDate(date) {
    const now = moment().local();
    const local = moment(date).local();
    return {
      original: date,
      originalJs: new Date(date),
      moment: local,
      local,
      br: local.toLocaleString(),
      momentFormat: local.format(),
      momentSimple: local.format('YYYY-MM-DDTHH:mm:ss'),
      timestampM: local.unix(),
      timestampS: local.valueOf(),
      now: moment().format(),
      diff: now.diff(local, 'hours')
    }
  }

  getDate(
    year: number,
    month: number,
    day: number,
    hour = 1,
    minutes = 0,
    interval = 1,
    unit: 'hour' | 'hours' | 'minute' | 'minutes' | 'day' | 'days' = 'hours'
  ) {
    const timezone = 'America/Sao_Paulo';
    const date = moment.tz({ year, month: month - 1, day, hour, minutes }, timezone);
    const dateJs = new Date();
    const tz = dateJs.getTimezoneOffset() / -60;

    return {
      now: moment().format(),
      nowJs: dateJs,
      nowJsString: Date(),
      nowEpochMillis: dateJs.getTime(),
      nowEpchSecs: Math.floor(dateJs.getTime() / 1000),
      tzOffset: dateJs.getTimezoneOffset(),
      tz,
      nowDateBr: dateJs.toLocaleDateString(),
      nowTimeBr: dateJs.toLocaleTimeString(),
      momentUtc: moment().utc().format(),
      moment: date,
      date: date.format(),
      dateJs: new Date(year, month, hour, minutes, 0),
      timestamp: date.format('YYYY-MM-DDTHH:mm:ss'),
      timestampz: date.format(),
      timestampzFixed: date.subtract('hour', 3).format(),
      epoch: date.unix(),
      epochSecs: date.valueOf(),
      day: date.date(),
      dayOfWeek: date.day(),
      dayOfWeekStr: date.weekday(),
      dayOfYear: date.dayOfYear(),
      daysInMonth: date.daysInMonth(),
      month: date.month(),
      monthParsed: date.month() + 1,
      year: date.year(),
      hour: date.hour(),
      minutes: date.minute()
    };
  }


  getDates(
    year: number,
    month: number,
    day: number,
    hour = 1,
    minutes = 0,
    interval = 1,
    unit: 'hour' | 'hours' | 'minute' | 'minutes' | 'day' | 'days' = 'hours'
  ) {
    //'YYYY-MM-DDThh:mm:ss'
    const endDate = moment({ year, month: month - 1, day })
      .hour(hour)
      .minutes(minutes)
    const startDate = moment(endDate).subtract(interval, unit).format();
    return { endDate: endDate.format(), startDate };
  }

  getToken() {
    return fetch(this.config.get('TOKEN_URL'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: this.config.get('API_ID'),
        client_secret: this.config.get('API_SECRET'),
        grant_type: 'client_credentials',
      })
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.error_description || errorData.error || 'Unknown error'}`);
        }
        return response.json();
      })
      // .then(data => {
      //   console.log("Token obtained:", data.access_token);
      // })
      .catch(error => {
        console.error("Failed to get token:", error.message);
      });
  }

  async getData(dataInicio = null, dataFim = null) {
    let token, url;
    console.log('solicitado dados para o intervalo entre: ', dataInicio, dataFim);
    try {
      url = new URL('findByPeriod', this.config.get('API_URL'));
      // url.searchParams.append('dataInicio', this.getCurrentDate(1));
      // url.searchParams.append('dataFim', this.getCurrentDate());
      // url.searchParams.append('dataInicio', '2025-01-02T00:41:37');
      // url.searchParams.append('dataFim', '2025-01-03T23:41:37');
      if (dataInicio && dataFim) {
        url.searchParams.append(dataInicio);
        url.searchParams.append(dataFim);
      } else {
        const date = this.getCurrentDate(1);
        console.log(date);
        url.searchParams.append('dataInicio', encodeURIComponent(date.startDateShort));
        url.searchParams.append('dataFim', encodeURIComponent(date.endDateShort));
      }
      console.log(url);
      token = await this.getToken();
    } catch (error) {
      console.log('Falha ao obter o token:', error);
    }

    return await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.error_description || errorData.error || 'Unknown error'}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Dados solicitados", data);
      })
      .catch(error => {
        console.error("Failed to get token:", error.message);
      });
  }

  async addJob(data: any) {
    try {
      await this.autoserviceQueue.add('process-autoservice-job', data);
      console.log('Job added to queue:', data);
    } catch (error) {
      console.log(error);
      // throw new AllExceptionsFilter();
    }

  }

  create(createAutoserviceDto: CreateAutoserviceDto) {
    return 'This action adds a new autoservice';
  }

  findAll() {
    return `This action returns all autoservice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} autoservice`;
  }

  update(id: number, updateAutoserviceDto: UpdateAutoserviceDto) {
    return `This action updates a #${id} autoservice`;
  }

  remove(id: number) {
    return `This action removes a #${id} autoservice`;
  }

  prepareData(fields, data) {
    // console.log('Fields:', fields);  // Verifique os campos a serem processados
    // console.log('Data:', data);      // Verifique os dados completos
    return fields.reduce((acc, field) => {
      if (data[field] !== undefined) {
        // Verifique o valor de data[field] para garantir que ele não é undefined
        console.log(`Processando campo: ${field} -> ${data[field]}`);
        acc[field] = field.includes('data_') ? new Date(data[field]) : data[field];
      }
      return acc;
    }, {});
  }

  extractFieldNames(obj) {
    return Object.keys(obj).filter(key => {
      return !(typeof obj[key] === 'string' && obj[key].startsWith('CK'));
    });
  }

  async mockData(format) {
    const path = require('path');
    const fs = require('fs').promises;
    try {
      const filePath = path.join(process.cwd(), `${format}.json`);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      const job = await this.autoserviceQueue.add('autoservice', data, {
        delay: 2000,
        attempts: 10,
      });
      // return data;
      return;
    } catch (err) {
      console.error('Erro ao ler o arquivo:', err);
      throw new Error('Falha ao carregar os dados do mock');
    }
  }

  extractData(data, fields) {
    const newData = fields.reduce((acc, field) => {
      if (data[field] != null && data[field] !== '') {
        if (field.startsWith('data_')) {
          acc[field] = this.convertDate(data[field]).local;
          // } else if (field.startsWith('valor_')) {
          //   acc[field] = data[field].toLocaleString('pt-BR');
        } else {
          acc[field] = data[field];
        }
      }
      return acc;
    }, {});

    return newData;
  };

  formatadorReais(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  async pastData(month) {
    const startMonth = moment().month(month).startOf('month');
    const endMonth = moment().month(month).endOf('month');
    const days = moment().month(month).daysInMonth();
    for (let i = 1; i <= days; i++) {
      const year = moment().year();
      const date = moment({ year, month, day: i });
      for (let h = 0; h < 24; h++) {
        const time = date.clone().add(h, 'hours');
        console.log(await this.autoserviceQueue.getActiveCount());
      }
    }
  }

  async retro(year, month, day, hour, status = false) {
    // console.log(this.getCurrentDate(1));
    // console.log(this.getDates(2025, 1, 23, 11))
    // const end = moment().month(month -1).set(day).set(hour);
    // const start = end.clone().subtract(1, 'hour');
    const date = this.getDate(2025, 1, 23, 12, 30);
    const endDate = this.getDate(2025, 1, 23, 13, 0);

    const dates = this.getDates(year, month, day, hour);
    const data = {
      endDate: endDate.date,
      startDate: date.date,
      status
    }
    console.log(date);
    console.log(data);
    const lastSearch = await this.prisma.lastSearch.upsert({
      where: {
        id: 1
      },
      create: data,
      update: data,
      select: {
        id: true,
        status: true,
        endDate: true,
        startDate: true
      }
    })

    const teste = await this.prisma.lastSearch.findFirst({
      where: {
        id: 1
      }
    })

    console.log(this.convertDate(teste.startDate));
    // return this.getData(end, start);
  }
}
