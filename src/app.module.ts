import { CustomLoggerModule } from './custom-logger/custom-logger.module';
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AutoserviceModule } from "./autoservice/autoservice.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ErrorInterceptor } from "./common/errors/error.interceptor";
import autoserviceConfig from "./autoservice/config/autoservice.config";
import { LoggerModule } from "nestjs-pino";
import { UtilModule } from "./util/util.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AssobravModule } from "./assobrav/assobrav.module";
import pino from "pino";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    CustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [autoserviceConfig],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get("REDIS_HOST"),
          port: config.get("REDIS_PORT"),
          password: config.get("REDIS_PASS"),
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      verboseMemoryLeak: true,
    }),
    AutoserviceModule,
    PrismaModule,
    HealthModule,
    UtilModule,
    AssobravModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // GlobalErrorHandler
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ErrorInterceptor,
    // },
    // UtilService,
    // AutoserviceHealthIndicator
  ],
})
export class AppModule { }
