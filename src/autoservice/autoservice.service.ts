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
import { QueueService } from "./queues/queue.service";
import { SqsConsumer } from "./sqs.consumer";
import { AxiosTokenInterceptor } from "./axios.interceptor";
import { CatchErrors } from "../decorators/catch-errors.decorator";
import { PrismaService } from "../prisma/prisma.service";

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
    private readonly queue: QueueService,
    private readonly sqs: SqsConsumer,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent("app.start")
  private async appStart() {
    console.log("aplicação iniciada");
    try {
      // await this.eventEmitter.emitAsync('queue.start');
      // await this.eventEmitter.emitAsync('sqs.start');
      // await this.eventEmitter.waitFor('app.free');
      // await this.checkAndStart();
      // await this.init(2025);
      // await this.test();
      await this.initRecursive(2025);
    } catch (error) {
      console.error("Erro durante evento app.start:", error);
    }
  }

  @CatchErrors()
  async makeRequest(dataInicio: string, dataFim: string) {
    console.log("Solicitando dados retroativos (request):", dataInicio);
    const { url, endpoint } = this.config.get("api");
    const response = await firstValueFrom(
      this.httpService.get(`${url}/${endpoint}`, { params: { dataInicio, dataFim } }).pipe(
        retry({
          count: Infinity,
          delay: () => timer(30000), // espera 30 segundos antes de cada nova tentativa
        }),
        catchError((error: AxiosError) => {
          console.error('Erro ao realizar request', dataInicio, dataFim, error.response.data);
          throw 'An error happened!';
        }),
      )
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

  @CatchErrors()
  async test() {
    const startDate = "2025-02-01T00:00:00";
    const endDate = "2025-02-28T23:59:59";
    await this.makeRequest(startDate, endDate);
  }

  @CatchErrors()
  public async init(
    year: number = 2024,
    month: number = 0,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
  ) {
    let currentDate: any;

    const lastParams = await this.prisma.loadDaily(year, month, day, hour, minute);

    if (lastParams && lastParams.status === "PENDING") {
      const dateStr = this.dates.setDate(
        lastParams.year,
        lastParams.month,
        lastParams.day,
        lastParams.hour,
        lastParams.minute,
      );
      currentDate = this.dates.getDateObject(dateStr);
    } else {
      // currentDate = this.dates.getDateObject();
      const dateStr = this.dates.setDate(year, month, day, hour, minute);
      currentDate = this.dates.getDateObject(dateStr);
    }

    const {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      hour: currentHour,
      minutes: currentMinutes,
      seconds: currentSeconds,
    } = currentDate;

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

    ({ month, day } = await this.processDates(month, year, day));
  }

  private async processDates(month: number, year: number, day: number) {
    let shouldStop = false;
    const batchSize = 500;
    let batch: any[] = [];

    outerMonthLoop: for (; month <= 12; month++) {
      const daysInMonth = this.dates.daysInMonth(year, month);

      outerDayLoop: for (; day <= daysInMonth; day++) {
        console.log(`Processando dia: ${day}`);

        outerHourLoop: for (let hour = 0; hour < 24; hour++) {
          if (await this.dates.isToday(year, month, day, hour)) {
            shouldStop = true;
            break outerHourLoop;
          }
          for (let minute = 0; minute < 60; minute += 10) {
            await this.prisma.recordDaily(year, month, day, hour, minute, "PROCESSING");
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
    return { month, day, shouldStop, batch };
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

  setLog(
    level: string,
    message: string,
    error: string,
    startDate?: string | Date,
    endDate?: string | Date,
  ) {
    return Logger[level](
      `message: ${message} \nErro: ${error} \nStartDate: ${startDate}, EndDate: ${endDate}`,
    );
  }

  public async initRecursive(
    year: number = 2024,
    month: number = 1,
    day: number = 8,
    hour: number = 0,
    minute: number = 0,
  ) {
    const now = new Date();
    const current = new Date(year, month, day, hour, minute);

    if (current >= now) {
      console.log("Finalizado.");
      return;
    }

    await this.eventEmitter.waitFor("sqs.empty").then(() => {
      console.log("PROXIMO REQUEST: Evento recebido para:", current.toString());
    });

    const { startDate, endDate } = await this.dates.getDates(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
      current.getHours(),
      current.getMinutes(),
    );
    await this.makeRequest(startDate, endDate);

    const next = new Date(current.getTime() + 60 * 60 * 1000);
    await this.initRecursive(
      next.getFullYear(),
      next.getMonth(),
      next.getDate(),
      next.getHours(),
      next.getMinutes(),
    );
  }

  // const esperarTresSegundos = async () => {
  //     console.log("Esperando 3 segundos...");
  //     await new Promise(resolve => setTimeout(resolve, 3000));
  //     console.log("Emitindo evento!");
  //     events.emit('complete');
  // };

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
