
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from './custom-logger/custom.logger';
import { PinoLogger } from 'nestjs-pino';
import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerHelper } from './custom-logger/logger-helper';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
//Apenas para compatibilidade com versões mais novas, remover depois
// import * as crypto from 'crypto';
// (globalThis as any).crypto = crypto;

async function bootstrap() {

  // if (process.env.NODE_ENV !== 'dev') {
  //   console.log = () => {};
  //   console.debug = () => {};
  //   console.warn = () => {};
  //   console.info = () => {};
  // }

  const logDirectory = 'logs';

  // Verifique se o diretório existe, se não, cria
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  const pinoLogger = await app.resolve(PinoLogger);

  app.useLogger(new CustomLogger(pinoLogger));
  const loggingService = app.get(CustomLoggerService);
  LoggerHelper.setService(loggingService);

  const { httpAdapter } = app.get(HttpAdapterHost);

  const config = new DocumentBuilder()
    .setTitle('Autoservice')
    .setDescription('Volkswagen Autoservice')
    .setVersion('1.0')
    .addTag('autoservice')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  await app.listen(3000);

  const eventEmitter = app.get(EventEmitter2);
  eventEmitter.emit('app.start');
}
bootstrap();
