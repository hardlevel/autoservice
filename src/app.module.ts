import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoserviceModule } from './autoservice/autoservice.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalErrorHandler } from './error.listenner';
import { HealthModule } from './health/health.module';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'Autoservice',
        transport: {
          target: 'pino-pretty'
        },
        stream: pino.destination({
          dest: './logs/autoservice.log',
          minLength: 4096,
          sync: false
        })
      }
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GlobalErrorHandler
  ],
})
export class AppModule {}
