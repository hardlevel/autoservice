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
  public startDate: string;
  public endDate: string;

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
    // private readonly tokenInterceptor: AxiosTokenInterceptor,
  ) { }

  @OnEvent('app.start')
  async appStart() {
    console.log('aplicação iniciada');
    try {
      await this.init(2024, 7),
        console.log('Processos concluídos');
    } catch (error) {
      console.error('Erro durante onApplicationBootstrap:', error);
    }
  }
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
    // try {
    //   // this.tokenInterceptor.attachInterceptors(this.httpService.axiosRef);
    //   // await Promise.all([
    //   // await this.dates.processYear(2024, 6, this.main),
    //   // await this.dates.processYear(2025, 0, this.main),
    //   // this.startProcess(2025, 0),
    //   await this.init(2025, 0, 25, 17),
    //     // this.startProcess(2024, 0),
    //     // ]);

    //     console.debug('Processos concluídos');
    // } catch (error) {
    //   console.error('Erro durante onApplicationBootstrap:', error);
    // }
  }

  // @Interval(10000)
  // async checkSqs() {
  //   console.debug('checando status do sqs');
  //   return this.sqs.isSqsActiveAndEmpty();
  // }


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



  // retry({
  //   count: Infinity,
  //   delay: async (error, retryCount) => {
  //     attempt = retryCount;
  //     const status = error?.response?.status;

  //     console.warn(`Tentativa ${attempt}: falhou com status ${status}, tentando novamente em 30s...`);

  //     if (attempt % 100 === 0) {
  //       this.log.setLog(
  //         'error',
  //         `⚠️ ${attempt} tentativas falharam ao solicitar dados da API Autoservice`,
  //         error.message,
  //         dataInicio,
  //         dataFim
  //       );
  //     }

  //     return timer(30000);
  //   },
  // }),

  // async mainProcess(startDate, endDate) {
  //   console.log('Processando fila', startDate, endDate);
  //   // console.log('Ouvintes registrados para sqsEmpty:', this.eventEmitter.listeners('sqsEmpty'));
  //   try {
  //     // while (!this.sqsEmpty) {
  //     //   console.log("SQS ainda processando mensagens...");
  //     //   await this.util.timer(3, "Aguardando SQS processar mensagens...");
  //     // }

  //     // while (this.isBusy) {
  //     //   await this.queuecheckQueue();
  //     //   await this.util.timer(3, "Fila do BullMQ ocupada, aguardando...");
  //     // }
  //     // Verifica se o SQS já está vazio
  //     // const sqsStatus = await this.sqs.getSqsStatus();
  //     // console.log('SQS Status:', sqsStatus);
  //     // if (sqsStatus === true) {
  //     //   // SQS já está vazio, prosseguir diretamente
  //     // } else {
  //     //   // Aguardar o evento sqsEmpty
  //     //   await this.eventEmitter.waitFor('sqsEmpty');
  //     // }

  //     // const access_token = await this.getToken();
  //     // if (!access_token) {
  //     //   throw new Error('Falha ao obter token de acesso');
  //     // }
  //     // const access_token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDS0NpU2M3WUxpZzlhSlR1ejRrZmlVTE9PbDVKWWFRemp1Uk9HWExYM1lJIn0.eyJleHAiOjE3NDQxMzE4NzEsImlhdCI6MTc0NDEzMTU3MSwianRpIjoiYWVjOTNjZTAtOTZlYi00MWU5LWEwNjAtNjlmM2EyYzIxMDVmIiwiaXNzIjoiaHR0cHM6Ly9pZHAudncuY29tLmJyL3JlYWxtcy9jRVNCLUQwNS1TQU1JUC1QUyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI0OGZjMTEzYS1kMmZlLTQ1YjMtOWFmNy1lMDA4ZDEyZGQxZDIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiIyNjlkYzcyOS1iYThiLTQxYzItODY3Ny1iNmIyNmI4MzY1Y2QiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtY2VzYi1kMDUtc2FtaXAtcHMiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiY2xpZW50SG9zdCI6IjMuMTQ1LjY4LjQ1IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtMjY5ZGM3MjktYmE4Yi00MWMyLTg2NzctYjZiMjZiODM2NWNkIiwiY2xpZW50QWRkcmVzcyI6IjMuMTQ1LjY4LjQ1IiwiY2xpZW50X2lkIjoiMjY5ZGM3MjktYmE4Yi00MWMyLTg2NzctYjZiMjZiODM2NWNkIn0.AuMwK3uGvRCDROOvBcS9CKjbCOksAMvFKxP8J0XvkPZOkOKPPtQmKGz5y3hMysgIo2ziMa6aYU-LvcXJPDQ0UAH1P5nWyESGRQLh3okX60FCjZTcTsZ5bg4S5OInzf4JEq8vuP3xED-LeiE_x0lYBsg8FR0R35b1zf1fmKp9JsEdVGLX9r-QF815va18hrIBjJEibw4M1RJVqkdYCDOxE9473GMs0XgI1imY57cl37HnKBbQ2gfxvW-Inoc16JQYfdrNeR95K6Jaky40LXEDEGJq6r9UzStrRw3gbo4xvFzeaxHEnDUxwqORvR4k7E5eaOe1_6utOOPRAJf6EnUIeg";
  //     const access_token = '';
  //     this.startDate = startDate;
  //     this.endDate = endDate;
  //     const dateObj = this.dates.getDateObject(startDate);
  //     const { day, hour, month, year } = dateObj;
  //     await this.log.saveLastParams({ day, hour, month, year });
  //     await this.makeRequest(access_token, startDate, endDate);
  //     // await this.makeRequest(startDate, endDate);
  //   } catch (error) {
  //     this.log.setLog('error', 'Falha ao solicitar dados da API do autoservice aaa', error.message);
  //   }
  // }

  // async checkQueueSqs() {
  //   let queueFree: boolean = true;

  //   const sqs = await this.sqs.isSqsActiveAndEmpty();
  //   const queue = await this.queue.getBullMqStatus();

  //   if (queue.waiting > 0) {
  //     queueFree = false;
  //   }

  //   this.eventEmitter.emit('sqsEmpty');
  //   return (queueFree && sqs) ? true : false;
  // }

  // async getToken(): Promise<string> {
  //   const { client_id, client_secret, url } = this.config.get('token');
  //   const body: TokenBody = {
  //     client_id,
  //     client_secret,
  //     grant_type: 'client_credentials'
  //   };

  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.post(url, body,
  //         {
  //           headers: {
  //             'Content-Type': 'application/x-www-form-urlencoded',
  //           },
  //         }
  //       )
  //     )
  //     return response.data.access_token;
  //   } catch (error) {
  //     throw new BadRequestException('Error obtaining access token');
  //   }
  // }


  // makeRequest(access_token: string, dataInicio: string, dataFim: string) {
  //   console.log('Solicitando dados retroativos (request):', dataInicio);

  //   if (!dataInicio || !dataFim) {
  //     throw new BadRequestException('Datas de início e fim não informadas');
  //   }
  //   const { url, endpoint } = this.config.get('api');

  //   return this.httpService.get(`${url}/${endpoint}`, {
  //     params: { dataInicio, dataFim },
  //     headers: { Authorization: `Bearer ${access_token}` },
  //   }).pipe(map((response) => response.data));
  // }

  // async mainProcess(startDate: string, endDate: string) {
  //   console.log('Processando fila', startDate, endDate);

  //   let attempt = 0;

  //   const observable = defer(() =>
  //     from(this.getToken()).pipe(
  //       concatMap((token) => this.makeRequest(token, startDate, endDate))
  //     )
  //   );

  //   const result = await firstValueFrom(
  //     observable.pipe(
  //       retry({
  //         count: 5,
  //         delay: async (error, retryCount) => {
  //           attempt = retryCount;

  //           const status = (error as AxiosError)?.response?.status;
  //           const responseData = (error as AxiosError).response?.data;
  //           const msg = (typeof responseData === 'object' && responseData && 'error' in responseData)
  //             ? (responseData as any).error
  //             : (error as AxiosError).message;

  //           console.warn(`Tentativa ${attempt}: erro: ${msg}`);

  //           return timer(10000);
  //         }
  //       }),
  //       tap(() => {
  //         if (attempt > 0) {
  //           console.log(`✅ Requisição bem-sucedida após ${attempt} tentativas.`);
  //         }
  //       }),
  //       concatMap(async (response) => {
  //         console.log('⌛ Aguardando 10 segundos para o SQS processar...');
  //         await this.util.progressBarTimer(10, 'aguardando para próxima requisição');
  //         return response;
  //       }),
  //       catchError((error: unknown) => {
  //         let msg = 'Erro desconhecido';

  //         if (error instanceof AxiosError) {
  //           console.error('❌ Erro Axios completo:', {
  //             status: error.response?.status,
  //             data: error.response?.data,
  //             headers: error.response?.headers
  //           });

  //           msg = error.response?.data?.error || error.message;
  //         } else if (error instanceof Error) {
  //           msg = error.message;
  //         } else {
  //           console.error('❌ Erro inesperado:', error);
  //         }

  //         this.log.setLog('error', 'Erro final após tentativas', msg, startDate, endDate);
  //         return throwError(() => new BadRequestException(msg));
  //       })
  //     )
  //   );

  //   return result;
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

  public async init(
    year: number = 2024,
    month: number = 0,
    day: number = 1,
    hour: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    interval = 1) {
    console.log('Iniciando requisições a partir de:', year, month, day, hour, minutes, seconds);
    const lastParams = await this.log.getLastParams(2025);
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
        return this.processCompleteTimestamp(lastYear, Math.max(0, lastMonth - 1), lastDay, lastHour, minutes, seconds);
      }
      // if (lastYear <= year && lastMonth <= month && lastDay <= day && lastHour <= hour) {
      //   return this.processCompleteTimestamp(lastYear, Math.max(0, lastMonth - 1), lastDay, lastHour, minutes, seconds, this.mainProcess.bind(this));
      // }
    }
    // return this.dates.processCompleteTimestamp(year, month, day, hour, minutes, seconds, this.sendJob.bind(this));
    return this.processCompleteTimestamp(year, month, day, hour, minutes, seconds);
  }

  public async processCompleteTimestamp(
    year: number = 2024,
    month: number = 0,
    day: number = 1,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
  ) {
    for (let m = month; m <= 11; m++) {
      const daysInMonth = this.dates.daysInMonth(year, m);
      const startDay = (m === month) ? day : 1;
      for (let d = startDay; d <= daysInMonth; d++) {
        const startHour = (m === month && d === day) ? hours : 0;
        for (let h = startHour; h < 24; h++) {
          const { startDate, endDate } = this.dates.getDates(year, m, d, h);
          const ready = await this.sqs.waitUntilSqsReallyEmptySafe(10, 6);
          if (!ready) {
            console.warn(`🚫 SQS não está estável. Abortando request para: ${startDate}`);
            continue;
          }
          await this.makeRequest(startDate, endDate);
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