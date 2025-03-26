(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
//teste

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from './custom.logger';
import { PinoLogger } from 'nestjs-pino';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const logDirectory = 'logs';

  // Verifique se o diretório existe, se não, cria
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  // const app = await NestFactory.create(AppModule, { bufferLogs: true });
  console.debug('iniciando app');
  const app = await NestFactory.create(AppModule);

  console.debug('iniciando pino')
  const pinoLogger = await app.resolve(PinoLogger);

  app.useLogger(new CustomLogger(pinoLogger));

  // app.useGlobalFilters(new AllExceptionsFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(
  //   new AllExceptionsFilter(httpAdapter),
  //   new PrismaClientExceptionFilter(httpAdapter)
  // );
  // app.useGlobalInterceptors(new ErrorsInterceptor());

  console.debug('iniciando swagger');
  const config = new DocumentBuilder()
    .setTitle('Autoservice')
    .setDescription('Volkswagen Autoservice')
    .setVersion('1.0')
    .addTag('autoservice')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  console.debug('iniciando pipes');
  app.useGlobalPipes(
    new ValidationPipe(),
    // new MoneyPipe(),
    // new DatePipe()
  );

  console.debug('iniciando escuta na porta 3000');
  await app.listen(3000);

  console.debug('todos processos realizados');
}
bootstrap();
