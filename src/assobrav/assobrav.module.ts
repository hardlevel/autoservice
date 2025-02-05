import { Module } from '@nestjs/common';
import { AssobravService } from './assobrav.service';
import { AssobravController } from './assobrav.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [PrismaModule, UtilModule],
  providers: [AssobravService],
  controllers: [AssobravController]
})
export class AssobravModule {}
