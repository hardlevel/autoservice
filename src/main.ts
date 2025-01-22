import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MoneyPipe } from './pipes/money.pipe';
import { DatePipe } from './pipes/date.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(),
    new MoneyPipe(),
    new DatePipe()
  );
  await app.listen(3000);
}
bootstrap();
