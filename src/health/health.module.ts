import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { AutoserviceModule } from '../autoservice/autoservice.module';
import { AutoserviceHealthIndicator } from '../autoservice/autoservice.health';

@Module({
    imports: [TerminusModule, HttpModule, PrismaModule, PrismaModule, AutoserviceModule],
    controllers: [HealthController],
    // providers: [AutoserviceHealthIndicator]
})
export class HealthModule { }
