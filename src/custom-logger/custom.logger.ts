import { LoggerService, ConsoleLogger } from '@nestjs/common';
import { LoggerModule, PinoLogger, Logger } from 'nestjs-pino';

export class CustomLogger implements LoggerService {
  private readonly consoleLogger = new ConsoleLogger('Autoservice');
  private readonly pinoLogger: PinoLogger;

  constructor(pinoLogger: PinoLogger) {
    this.pinoLogger = pinoLogger;
  }

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
