import { BadRequestException, Inject, Injectable, Logger, LoggerService, OnApplicationBootstrap, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, isNotConnectionError } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { Message } from "@aws-sdk/client-sqs";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
// import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as moment from 'moment';
import { CustomError } from '../common/errors/custom-error';
import { ErrorMessages } from '../common/errors/messages';
import { UtilService } from '../util/util.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { catchError, firstValueFrom, last, retry, startWith } from 'rxjs';
import { Interval } from '@nestjs/schedule';
import { LazyModuleLoader } from '@nestjs/core';
import { Decimal } from '@prisma/client/runtime/library';
import { DateService } from '../util/date.service';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { LogService } from './log.service';

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
export class AutoserviceService implements OnApplicationBootstrap {
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
  ) { }

  async onApplicationBootstrap() {
    try {
      await Promise.all([
        // await this.dates.processYear(2024, 6, this.main),
        // await this.dates.processYear(2025, 0, this.main),
        // this.startProcess(2025, 0),
        this.main(2024, 5),
        // this.startProcess(2024, 0),
      ]);

      console.debug('Processos concluídos');
    } catch (error) {
      console.error('Erro durante onApplicationBootstrap:', error);
    }
  }

  async getToken() {
    const { apiId: client_id, apiSecret: client_secret, url } = this.config.get('token');
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
      throw new Error('Error obtaining access token');
    }
  }

  async makeRequest(access_token: string, dataInicio: string, dataFim: string) {
    const { url } = this.config.get('api');

    try {
      if (!access_token) throw new BadRequestException('Access Token não informado');
      if (!dataInicio || !dataFim) throw new BadRequestException('Datas de início e fim não informadas');

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { dataInicio, dataFim },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }).pipe(
          retry({
            count: Infinity,
            delay: 30000,
          }),
          catchError((error: AxiosError) => {
            this.log.setLog(
              'error',
              'Falha ao solicitar dados da API Autoservice',
              error.message,
              dataInicio,
              dataFim
            );
            throw new BadRequestException('Falha ao solicitar dados da API Autoservice');
          }),
        ),
      );
    } catch (error) {
      throw new Error('Error obtaining access token: ' + error.message);
    }
  }

  async main(startDate, endDate) {
    console.debug('Processando fila no novo consumer', startDate);
    const { access_token } = await this.getToken();
    try {
      // while (!this.sqsEmpty) {
      //   console.log("SQS ainda processando mensagens...");
      //   await this.util.timer(3, "Aguardando SQS processar mensagens...");
      // }

      // while (this.isBusy) {
      //   await this.queuecheckQueue();
      //   await this.util.timer(3, "Fila do BullMQ ocupada, aguardando...");
      // }
      this.eventEmitter.waitFor('sqsEmpty');

      this.startDate = startDate;
      this.endDate = endDate;

      await this.makeRequest(access_token, startDate, endDate);
    } catch (error) {
      this.log.setLog('error', 'Falha ao solicitar dados da API do autoservice', error.message);
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
