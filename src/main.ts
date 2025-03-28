(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

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

  const app = await NestFactory.create(AppModule);

  const pinoLogger = await app.resolve(PinoLogger);

  app.useLogger(new CustomLogger(pinoLogger));

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
}
bootstrap();
