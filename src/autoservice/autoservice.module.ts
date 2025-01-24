import { Module } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { AutoserviceController } from './autoservice.controller';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { SQSClient } from '@aws-sdk/client-sqs';
import { AutoserviceProcessor } from './autoservice.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { Ck3Service } from './ck3.service';
import { Ck4Service } from './ck4.service';
import { Ck7Service } from './ck7.service';
import { Ck5Service } from './ck5.service';
import { Ck6Service } from './ck6.service';
import { GlobalErrorHandler } from '../error.listenner';

@Module({
  controllers: [AutoserviceController],
  providers: [
    AutoserviceService,
    ConfigModule,
    AutoserviceProcessor,
    GlobalErrorHandler,
    Ck3Service,
    Ck4Service,
    Ck5Service,
    Ck6Service,
    Ck7Service
  ],
  imports: [
    PrismaModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const accessKeyId: string = configService.get('SQS_ID');
        const secretAccessKey: string = configService.get('SQS_SECRET');
        const queueUrl: string = configService.get('SQS_URL');
        const region: string = 'us-east-2';
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
    BullModule.registerQueueAsync({
      name: 'autoservice'
    })
  ]
})
export class AutoserviceModule { }
