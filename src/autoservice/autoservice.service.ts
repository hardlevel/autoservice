import { BadRequestException, Inject, Injectable, Logger, LoggerService, OnApplicationBootstrap, OnModuleInit, ServiceUnavailableException, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '../util/util.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { catchError, concatMap, defer, firstValueFrom, from, last, map, retry, startWith, tap, throwError, timer } from 'rxjs';
import { Interval } from '@nestjs/schedule';
import { LazyModuleLoader } from '@nestjs/core';
import { DateService } from '../util/date.service';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { LogService } from './log.service';
import { QueueService } from './queue.service';
import { SqsConsumer } from './sqs.consumer';
import { AxiosTokenInterceptor } from './axios.interceptor';
import { StateService } from './state.service';

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
export class AutoserviceService {
  public startDate: string;
  public endDate: string;
  public isBusy: boolean = true;

  constructor(
    private lazyModuleLoader: LazyModuleLoader,
    private readonly config: ConfigService,
    private readonly util: UtilService,
    private readonly eventEmitter: EventEmitter2,
    private readonly dates: DateService,
    private readonly httpService: HttpService,
    private readonly log: LogService,
    private readonly queue: QueueService,
    private readonly sqs: SqsConsumer,
    private readonly state: StateService,
  ) { }

  @OnEvent('app.start')
  private async appStart() {
    console.log('aplicação iniciada');
    try {
      await this.eventEmitter.emitAsync('queue.start');
      await this.eventEmitter.emitAsync('sqs.start');
      await this.eventEmitter.waitFor('app.free');
      await this.checkAndStart();
      // await this.init(2024, 7),
      // await this.util.progressBarTimer(5);
      // await this.eventEmitter.emit('queue.start');
      // await this.eventEmitter.emit('sqs.start');
      // // await this.state.waitBullBusy();
      // await this.eventEmitter.waitFor('bull.free');
      // console.log('bull free');
      // await this.eventEmitter.waitFor('sqs.free');
      // console.log('sqs free');
      // await this.processYear(2025, 3, 11);
      // console.log('Processos concluídos');
    } catch (error) {
      console.error('Erro durante evento app.start:', error);
    }
  }

  async checkAndStart() {
    const state = this.state.getState();
    console.log('State atual:', state);
    if (state === 'free') {
      console.log('SQS e BullMQ livres. Iniciando processYear...');
      await this.processYear(2025, 3, 11);
    } else {
      console.log('SQS ou BullMQ ocupados. Aguardando liberação...');
      const listener = async () => {
        if (this.state.getState() === 'free') {
          console.log('Ambos livres agora. Iniciando processYear...');
          this.eventEmitter.off('bull.free', listener);
          this.eventEmitter.off('sqs.bull.free', listener);
          await this.processYear(2025, 3, 11);
        }
      };
      this.eventEmitter.on('bull.free', listener);
      this.eventEmitter.on('sqs.bull.free', listener);
    }
  }


  @OnEvent('updateDates')
  updateDates(payload) {
    const { startDate, endDate } = payload;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  // @Interval(10000)
  // async checkSqs() {
  //   console.debug('checando status do sqs');
  //   return this.sqs.isSqsActiveAndEmpty();
  // }

  async makeRequest(dataInicio: string, dataFim: string) {
    console.log('Solicitando dados retroativos (request):', dataInicio);
    const { url, endpoint } = this.config.get('api');
    const response = await firstValueFrom(
      this.httpService.get(`${url}/${endpoint}`, { params: { dataInicio, dataFim } }),
    );
    console.log(response.data);
    return response.data;
  }

  public async processYear(year: number = 2024, month: number = 1, day: number = 1, hour: number = 0, minutes: number = 0, seconds: number = 0, interval = '30m') {
    console.log(`Starting to process year ${year} from month ${month}, day ${day}`);
    const today = this.dates.getDateObject(new Date().toString());
    const currentYear = today.year;
    const currentMonth = today.month;

    const lastMonth = year < currentYear
      ? 12
      : year === currentYear
        ? currentMonth
        : 0;

    if (lastMonth === 0) {
      return;
    }

    for (let m = month; m <= lastMonth; m++) {
      console.log(`Processing year ${year}, month ${m}`);
      const startDay = (m === month) ? day : 1;
      const startHour = (m === month) ? hour : 0;
      const startMinute = (m === month) ? minutes : 0;
      const startSecond = (m === month) ? seconds : 0;
      try {
        await this.queue.manageFlow(
          year,
          m,
          startDay,
          startHour,
          startMinute,
          startSecond,
          interval
        );
      } catch (error) {
        console.error(`Failed to process month ${m} of year ${year}:`, error);
      // await this.queue.manageFlow(year, m, day, hour, minutes, seconds, interval);
    }
  }
  }
}
  // public async init(
  //   year: number = 2024,
  //   month: number = 0,
  //   day: number = 1,
  //   hour: number = 0,
  //   minutes: number = 0,
  //   seconds: number = 0,
  //   interval = 1) {
  //   console.log('Iniciando requisições a partir de:', year, month, day, hour, minutes, seconds);
  //   const lastParams = await this.log.getLastParams(2025);
  //   if (lastParams) {
  //     const { day: lastDay, hour: lastHour, month: lastMonth, year: lastYear } = lastParams;
  //     // if (year === lastYear && month === lastMonth && day === lastDay && hour === lastHour) {
  //     //   return;
  //     // }
  //     if (
  //       lastYear < year ||
  //       (lastYear === year && lastMonth < month) ||
  //       (lastYear === year && lastMonth === month && lastDay < day) ||
  //       (lastYear === year && lastMonth === month && lastDay === day && lastHour < hour)
  //     ) {
  //       return this.process(lastYear, Math.max(0, lastMonth - 1), lastDay, lastHour, minutes, seconds);
  //     }
  //     // if (lastYear <= year && lastMonth <= month && lastDay <= day && lastHour <= hour) {
  //     //   return this.processCompleteTimestamp(lastYear, Math.max(0, lastMonth - 1), lastDay, lastHour, minutes, seconds, this.mainProcess.bind(this));
  //     // }
  //   }
  //   // return this.dates.processCompleteTimestamp(year, month, day, hour, minutes, seconds, this.sendJob.bind(this));
  //   return this.process(year, month, day, hour, minutes, seconds);
  // }

  // public async process(
  //   year: number = 2024,
  //   month: number = 0,
  //   day: number = 1,
  //   hours: number = 0,
  //   minutes: number = 0,
  //   seconds: number = 0,
  // ) {
  //   for (let m = month; m <= 11; m++) {
  //     const daysInMonth = this.dates.daysInMonth(year, m);
  //     const startDay = (m === month) ? day : 1;
  //     for (let d = startDay; d <= daysInMonth; d++) {
  //       const startHour = (m === month && d === day) ? hours : 0;
  //       for (let h = startHour; h < 24; h++) {
  //         const { startDate, endDate } = this.dates.getDates(year, m, d, h);
  //         const ready = await this.sqs.waitUntilSqsReallyEmptySafe(10, 6);
  //         if (!ready) {
  //           console.warn(`🚫 SQS não está estável. Abortando request para: ${startDate}`);
  //           continue;
  //         }
  //         // await this.makeRequest(startDate, endDate);
  //       }
  //     }
  //   }
  // }


//TODO
// criar eventos nas queue quando acaberem para que acionem uma função no onEvent, essa função deve verificar se o sqs está ativo
//limpar codigo comentado
//checar a checagem de status da queue, talvez não seja necessário esperar tudo concluir para adicionar novas tarefas
//checar a mensagem recebida no sqs para verificar se há dados que ajudem a depurar a quantidade total
//testar flow com 3 filas, uma para cada dia e hora, uma para requests e outra para salvar os dados