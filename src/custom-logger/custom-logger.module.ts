import { PrismaModule } from '../prisma/prisma.module';
import { CustomLoggerService } from './custom-logger.service';
import { Module } from '@nestjs/common';
import { CustomLogger } from './custom.logger';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        PrismaModule,
        LoggerModule.forRoot({
            pinoHttp: {
                level: process.env.NODE_ENV === "prod" ? "info" : "debug",
                customLevels: { autoserviceError: 35 },
                useOnlyCustomLevels: false,
                // autoLogging: process.env.NODE_ENV !== 'prod',
                autoLogging: false,
                transport: {
                    targets: [
                        {
                            target: "pino-pretty",
                            options: {
                                colorize: true,
                                translateTime: "SYS:standard",
                                ignore: "pid,hostname",
                            },
                        },
                        {
                            target: "pino/file",
                            options: {
                                destination: "logs/autoservice.log",
                                mkdir: true,
                            },
                        },
                    ],
                },
                timestamp: () => `,"time":"${new Date().toISOString()}"`,
                base: { service: "autoservice-api", version: "1.0.0" },
                messageKey: "message",
            },
        }),
    ],
    exports: [CustomLoggerService, CustomLogger],
    controllers: [],
    providers: [
        CustomLoggerService,
        CustomLogger
    ],
})
export class CustomLoggerModule { }
