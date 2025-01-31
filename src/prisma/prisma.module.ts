import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UtilModule } from '../util/util.module';

@Module({
    imports: [UtilModule],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}
