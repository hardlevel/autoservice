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
// import { LoggerModule } from 'nestjs-pino';
import { UtilService } from './util/util.service';
import { UtilModule } from './util/util.module';
// import pino from 'pino';
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
    AutoserviceModule,
    PrismaModule,
    HealthModule,
    UtilModule,
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     name: 'Autoservice',
    //     transport: {
    //       target: 'pino-pretty'
    //     },
    //     stream: pino.destination({
    //       dest: './logs/autoservice.log',
    //       minLength: 4096,
    //       sync: false
    //     })
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
  ],
})
export class AppModule {}
