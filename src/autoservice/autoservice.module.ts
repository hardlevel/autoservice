import { Module } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { AutoserviceController } from './autoservice.controller';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
// import { AutoserviceProcessor } from './autoservice.processor';

@Module({
  controllers: [AutoserviceController],
  providers: [
    AutoserviceService,
    ConfigModule,
    // AutoserviceProcessor
  ],
  imports: [
    SqsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        consumers: [],
        producers: [
          {
            name: 'Autoservice',
            queueUrl: config.get('SQS_URL')
          }
        ]
      })
    }),
    BullModule.registerQueueAsync({
      // inject: [ConfigService],
      name: 'autoservice'
    })
  ]
})
export class AutoserviceModule { }
