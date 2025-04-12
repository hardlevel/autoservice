import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
  OnModuleInit,
  ServiceUnavailableException,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UtilService } from "../util/util.service";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import {
  catchError,
  concatMap,
  defer,
  firstValueFrom,
  from,
  last,
  map,
  retry,
  startWith,
  tap,
  throwError,
  timer,
} from "rxjs";
import { Interval } from "@nestjs/schedule";
import { LazyModuleLoader } from "@nestjs/core";
import { DateService } from "../util/date.service";
import { AxiosError } from "axios";
import { HttpService } from "@nestjs/axios";
import { LogService } from "./log.service";
import { QueueService } from "./queue.service";
import { SqsConsumer } from "./sqs.consumer";
import { AxiosTokenInterceptor } from "./axios.interceptor";
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
  ) {}

  @OnEvent("app.start")
  private async appStart() {
    console.log("aplicação iniciada");
    try {
      // await this.eventEmitter.emitAsync('queue.start');
      // await this.eventEmitter.emitAsync('sqs.start');
      // await this.eventEmitter.waitFor('app.free');
      // await this.checkAndStart();
      await this.init(2025, 3, 10);
    } catch (error) {
      console.error("Erro durante evento app.start:", error);
    }
  }

  async makeRequest(dataInicio: string, dataFim: string) {
    console.log("Solicitando dados retroativos (request):", dataInicio);
    const { url, endpoint } = this.config.get("api");
    const response = await firstValueFrom(
      this.httpService.get(`${url}/${endpoint}`, { params: { dataInicio, dataFim } }),
    );
    console.log(response.data);
    return response.data;
  }

  @OnEvent("updateDates")
  updateDates(payload) {
    const { startDate, endDate } = payload;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public async init(
    year: number = 2024,
    month: number = 1,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
  ) {
    const batchSize = 500;
    let batch: any[] = [];

    const {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      hour: currentHour,
      minutes: currentMinutes,
      seconds: currentSeconds,
    } = this.dates.getDateObject();

    if (year > currentYear) {
      year = currentYear;
    }

    if (year === currentYear && month > currentMonth) {
      month = currentMonth;
    }

    if (year === currentYear && month === currentMonth && day > currentDay) {
      day = currentDay;
    }

    console.log("Iniciando o loop de adição dos jobs...");
    console.log(`Processando ano: ${year}`);

    let shouldStop = false;

    outerMonthLoop: for (; month <= 12; month++) {
      const daysInMonth = this.dates.daysInMonth(year, month);

      outerDayLoop: for (; day <= daysInMonth; day++) {
        console.log(`Processando dia: ${day}`);

        outerHourLoop: for (let hour = 0; hour < 24; hour++) {
          if (await this.dates.isToday(year, month, day, hour)) {
            shouldStop = true;
            break outerHourLoop; // Interrompe o loop de horas
          }
          for (let minute = 0; minute < 60; minute += 10) {
            const data = { year, month, day, hour, minute };
            batch.push({
              name: "hourly",
              data,
              opts: {
                removeOnComplete: true,
                removeOnFail: false,
                attempts: 10,
                backoff: 3,
              },
            });

            if (batch.length >= batchSize) {
              console.log("Adicionando jobs em bulk");
              await this.queue.bulkAddJobs("hourly", batch);
              batch = [];
            }
          }

          if (shouldStop) break outerDayLoop;
        }

        if (shouldStop) break outerMonthLoop;
      }

      if (month < 12) {
        day = 1;
      }

      if (shouldStop) break;
    }

    if (batch.length > 0) {
      await this.queue.bulkAddJobs("hourly", batch);
    }
  }

  async checkHourlyQueue() {
    await this.eventEmitter
      .waitFor("hourly.empty")
      .then(() => console.log("Evento hourly.empty recebido!"))
      .catch((err) => console.error("Erro aguardando hourly.empty:", err));
  }

  async checkHourlyQueueB() {
    await this.eventEmitter
      .emitAsync("queue.check", "hourly")
      .then((data) => console.log("teste status hourly", data));
  }

  // public async processYear(
  //   year: number = 2024,
  //   month: number = 1,
  //   day: number = 1,
  //   hour: number = 0,
  //   minutes: number = 0,
  //   seconds: number = 0,
  //   interval = "30m",
  // ) {
  //   console.log(`Starting to process from ${year}-${month}-${day} ${hour}:${minutes}`);

  //   const now = this.dates.getDateObject(new Date().toString());

  //   for (let y = year; y <= now.year; y++) {
  //     const startMonth = y === year ? month : 1;
  //     const endMonth = y === now.year ? now.month : 12;

  //     for (let m = startMonth; m <= endMonth; m++) {
  //       const startDay = y === year && m === month ? day : 1;
  //       const daysInMonth = this.dates.daysInMonth(y, m);
  //       const endDay = y === now.year && m === now.month ? now.day : daysInMonth;

  //       for (let d = startDay; d <= endDay; d++) {
  //         const startHour = y === year && m === month && d === day ? hour : 0;
  //         const endHour = y === now.year && m === now.month && d === now.day ? now.hour : 23;

  //         for (let h = startHour; h <= endHour; h++) {
  //           const startMinute = y === year && m === month && d === day && h === hour ? minutes : 0;
  //           const endMinute =
  //             y === now.year && m === now.month && d === now.day && h === now.hour
  //               ? now.minute
  //               : 59;

  //           for (let min = startMinute; min <= endMinute; min += 10) {
  //             const data = {
  //               year: y,
  //               month: m,
  //               day: d,
  //               hour: h,
  //               minute: min,
  //               step: `process hour ${h} for day ${d}`,
  //             };
  //             await this.state.waitForFreeState();
  //             try {
  //               const { startDate, endDate } = this.dates.getDatesFormatMinutes(
  //                 data.year,
  //                 data.month,
  //                 data.day,
  //                 data.minute,
  //               );
  //               await this.makeRequest(startDate, endDate);
  //             } catch (error) {
  //               console.error("Erro ao enviar mensagem para SQS:", error);
  //             }
  //             // await this.queue.addJobToQueue('hourly', data);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}

//TODO
// criar eventos nas queue quando acaberem para que acionem uma função no onEvent, essa função deve verificar se o sqs está ativo
//limpar codigo comentado
//checar a checagem de status da queue, talvez não seja necessário esperar tudo concluir para adicionar novas tarefas
//checar a mensagem recebida no sqs para verificar se há dados que ajudem a depurar a quantidade total
//testar flow com 3 filas, uma para cada dia e hora, uma para requests e outra para salvar os dados
