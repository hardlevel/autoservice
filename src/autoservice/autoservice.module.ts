import { Module } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { AutoserviceController } from './autoservice.controller';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { SQSClient } from '@aws-sdk/client-sqs';
import { AutoserviceProcessor } from './autoservice.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { Ck3Service } from './ck3.service';
import { Ck4Service } from './ck4.service';
import { Ck5Service } from './ck5.service';
import { Ck6Service } from './ck6.service';
import { Ck7Service } from './ck7.service';
import { UtilModule } from '../util/util.module';
import { AutoserviceHealthIndicator } from './autoservice.health';
import { HttpModule } from '@nestjs/axios';
import { SqsConsumer } from './sqs.consumer';
import { QueueService } from './queue.service';
import { ApiService } from './api.service';
import { LogService } from './log.service';
import { AxiosTokenInterceptor } from './axios.interceptor';
import { TokenService } from './token.service';
import { DailyConsumer } from './daily.queue';
import { MonthlyConsumer } from './monthly.queue';
import { HourlyConsumer } from './hourly.queue';
// import { LoggerModule } from 'nestjs-pino';

@Module({
  controllers: [AutoserviceController],
  providers: [
    AutoserviceService,
    ConfigModule,
    AutoserviceProcessor,
    // GlobalErrorHandler,
    Ck3Service,
    Ck4Service,
    Ck5Service,
    Ck6Service,
    Ck7Service,
    SqsConsumer,
    QueueService,
    ApiService,
    LogService,
    AutoserviceHealthIndicator,
    TokenService,
    AxiosTokenInterceptor,
    DailyConsumer,
    MonthlyConsumer,
    HourlyConsumer
  ],
  exports: [AutoserviceHealthIndicator, AutoserviceService],
  imports: [
    // LoggerModule,
    UtilModule,
    ConfigModule,
    PrismaModule,
    HttpModule,
    SqsModule.registerAsync({
      useFactory: async (configuration: ConfigService) => {
        const sqs = configuration.get('sqs');
        const { accessKeyId, secretAccessKey, queueUrl, region } = sqs;
        return {
          consumers: [
            {
              name: 'autoservice',
              region,
              queueUrl,
              batchSize: 1,
              // requestTimeout: 10000,
              // handleMessageTimeout: 10000,
              shouldDeleteMessages: true,
              // waitTimeSeconds: 5,
              extendedAWSErrors: true,
              terminateGracefully: true,
              sqs: new SQSClient({
                region,
                credentials: {
                  accessKeyId,
                  secretAccessKey,
                },
              }),
            },
          ],
          producers: [],
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync(
      {
        name: 'autoservice'
      },
      {
        name: 'daily'
      },
      {
        name: 'monthly'
      },
      {
        name: 'hourly'
      }
    ),
    BullModule.registerFlowProducer({
      name: 'autoserviceFlow',
    })
  ]
})
export class AutoserviceModule { }
