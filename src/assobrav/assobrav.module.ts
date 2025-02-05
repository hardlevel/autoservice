import { Module } from '@nestjs/common';
import { AssobravService } from './assobrav.service';
import { AssobravController } from './assobrav.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilModule } from '../util/util.module';
import { OsService } from './os.service';
import { NfsService } from './nfs.service';

@Module({
  imports: [PrismaModule, UtilModule],
  providers: [AssobravService, OsService, NfsService],
  controllers: [AssobravController]
})
export class AssobravModule {}
