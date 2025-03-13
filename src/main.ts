(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};


import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { Logger } from 'nestjs-pino';
// import { MoneyPipe } from './pipes/money.pipe';
// import { DatePipe } from './pipes/date.pipe';
// import { HttpExceptionFilter } from './http.exceptions';
// import { PrismaExceptionFilter } from './prisma.exceptions';
// import { AllExceptionsFilter } from './all.exceptions';
// import { ErrorsInterceptor } from './error.interceptor';
// import { PrismaClientExceptionFilter } from './prisma.exceptions';
// import * as moment from 'moment-timezone';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const app = await NestFactory.create(AppModule);
  // app.useLogger(app.get(Logger));
  // moment().zone("-03:00");
  // moment.tz.setDefault('Ameriza/Sao_Paulo');
  // app.useGlobalFilters(new AllExceptionsFilter({ httpAdapter: app.getHttpAdapter() }));

  // app.useGlobalFilters(new AllExceptionsFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(
  //   new AllExceptionsFilter(httpAdapter),
  //   new PrismaClientExceptionFilter(httpAdapter)
  // );
  // app.useGlobalInterceptors(new ErrorsInterceptor());

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
    // new MoneyPipe(),
    // new DatePipe()
  );

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new CatchEverythingFilter(httpAdapter));

  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(3000);
}
bootstrap();
