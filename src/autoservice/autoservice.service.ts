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

  async makeRequest(dataInicio: string, dataFim: string) {
    console.log('Solicitando dados retroativos (request):', dataInicio);
    const { url, endpoint } = this.config.get('api');
    const response = await firstValueFrom(
      this.httpService.get(`${url}/${endpoint}`, { params: { dataInicio, dataFim } }),
    );
    console.log(response.data);
    return response.data;
  }

  public async processYear(
    year: number = 2024,
    month: number = 1,
    day: number = 1,
    hour: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    interval = '30m',
  ) {
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

    for (let monthIndex = month; monthIndex <= lastMonth; monthIndex++) {
      console.log(`Processing year ${year}, month ${monthIndex}`);

      const startDay = (monthIndex === month) ? day : 1;
      const startHour = (monthIndex === month) ? hour : 0;
      const startMinute = (monthIndex === month) ? minutes : 0;
      const startSecond = (monthIndex === month) ? seconds : 0;
      const daysInMonth = this.dates.daysInMonth(year, monthIndex);

      for (let d = startDay; d <= daysInMonth; d++) {
        const dayStartHour = (d === day && monthIndex === month) ? hour : 0;

        for (let h = dayStartHour; h < 24; h++) {
          const minuteStart = (d === day && h === hour && monthIndex === month) ? minutes : 0;

          for (let minute = minuteStart; minute < 60; minute += 10) {
            const data = {
              year,
              month: monthIndex,
              day: d,
              hour: h,
              minute,
              step: `process hour ${h} for day ${d}`
            };

            await this.queue.addJobToQueue('hourly', data);
          }
        }
      }
    }
  }
}


//TODO
// criar eventos nas queue quando acaberem para que acionem uma função no onEvent, essa função deve verificar se o sqs está ativo
//limpar codigo comentado
//checar a checagem de status da queue, talvez não seja necessário esperar tudo concluir para adicionar novas tarefas
//checar a mensagem recebida no sqs para verificar se há dados que ajudem a depurar a quantidade total
//testar flow com 3 filas, uma para cada dia e hora, uma para requests e outra para salvar os dados