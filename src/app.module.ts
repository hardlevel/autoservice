import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoserviceModule } from './autoservice/autoservice.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
// import { APP_FILTER } from '@nestjs/core';
// import { GlobalErrorHandler } from './error.listenner';
import { HealthModule } from './health/health.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './common/errors/error.interceptor';
import autoserviceConfig from './autoservice/config/autoservice.config';
import { LoggerModule } from 'nestjs-pino';
import { UtilService } from './util/util.service';
import { UtilModule } from './util/util.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AssobravModule } from './assobrav/assobrav.module';
import pino from 'pino';
import { ScheduleModule } from '@nestjs/schedule';
import { AutoserviceHealthIndicator } from './autoservice/autoservice.health';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [autoserviceConfig]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PASS')
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    AutoserviceModule,
    PrismaModule,
    HealthModule,
    UtilModule,
    AssobravModule,
    ScheduleModule.forRoot(),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     level: process.env.NODE_ENV == 'prod' ? 'info' : 'debug',
    //     customLevels: { autoserviceError: 35 },
    //     useOnlyCustomLevels: false,
    //     transport: {
    //       target: 'pino/file',
    //       options: { destination: 'logs/autoservice.log' },
    //     },
    //   },
    // }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
        customLevels: { autoserviceError: 35 },
        useOnlyCustomLevels: false,
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            },
            {
              target: 'pino/file',
              options: {
                destination: 'logs/autoservice.log',
                mkdir: true,
              },
            },
          ],
        },
        // genReqId: (req) => req.headers['x-request-id'] || req.id,
        // customProps: (req, res) => ({
        //   context: 'HTTP',
        // }),
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
        base: { service: 'autoservice-api', version: '1.0.0' },
        messageKey: 'message',
      },
    })

    // LoggerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       pinoHttp: {
    //         name: 'Autoservice',
    //         transport: {
    //           target: 'pino-pretty'
    //         },
    //         stream: pino.destination({
    //           dest: './logs/autoservice.log',
    //           minLength: 4096,
    //           sync: false
    //         })
    //       }
    //     }
    //   }
    // })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // GlobalErrorHandler
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    UtilService,
    AutoserviceHealthIndicator
  ],
})
export class AppModule { }
