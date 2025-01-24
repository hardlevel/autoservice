import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [TerminusModule, HttpModule, PrismaModule, PrismaModule],
    controllers: [HealthController]
})
export class HealthModule {}
