import { Module } from '@nestjs/common';
import { UtilService } from './util.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [UtilService],
  exports: [UtilService]
})
export class UtilModule { }
