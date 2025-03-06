import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UtilModule } from '../util/util.module';
import { PrismaSqlService } from './prisma-sql.service';

@Module({
    imports: [UtilModule],
    providers: [PrismaService, PrismaSqlService],
    exports: [PrismaService, PrismaSqlService]
})
export class PrismaModule { }
