import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // ajuste se necessário
import { CustomLogger } from './custom.logger';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CustomLoggerService {
    private readonly consoleLogger = new ConsoleLogger('Autoservice');

    constructor(
        private readonly prisma: PrismaService,
        private readonly pinoLogger: PinoLogger
    ) { }

    async logErrorToDb(error: any, context: string) {
        try {
            //   await this.prisma.log.create({
            //     data: {
            //       message: error.message || 'Unknown error',
            //       stack: error.stack || '',
            //       context,
            //       createdAt: new Date(),
            //     },
            //   });
        } catch (err) {
            this.error('Erro ao salvar log no banco', err.stack);
        }
    }

    // logError(message: string, error?: any) {
    //     this.error(message, error?.stack);
    // }



    log(message: string) {
        this.consoleLogger.log(message);
        // this.pinoLogger.info(message);
    }

    error(message: string, trace?: string) {
        this.consoleLogger.error(message, trace);
        this.pinoLogger.error({ trace }, message);
    }

    warn(message: string) {
        this.consoleLogger.warn(message);
        this.pinoLogger.warn(message);
    }

    debug(message: string) {
        this.consoleLogger.debug(message);
        this.pinoLogger.debug(message);
    }

    verbose(message: string) {
        this.consoleLogger.verbose(message);
        this.pinoLogger.trace(message);
    }

    autoserviceError(message: string, startDate: Date, endDate: Date) {
        this.pinoLogger.error({ custom: true }, message, startDate, endDate);
    }
}
