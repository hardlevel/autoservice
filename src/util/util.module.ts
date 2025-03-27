import { Module } from '@nestjs/common';
import { UtilService } from './util.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DateService } from './date.service';

@Module({
  providers: [UtilService, DateService],
  exports: [UtilService, DateService]
})
export class UtilModule { }
