import { Injectable } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class AutoserviceHealthIndicator extends HealthIndicator {
    constructor(
        private readonly autoservice: AutoserviceService,
    ) { super() }

    async isHealthySqs(key: string): Promise<HealthIndicatorResult> {
        const status = await this.autoservice.getSqsStatus();
        const isHealthy = status === true;

        const result = this.getStatus(key, isHealthy, {
            status: isHealthy ? 'up' : 'down',
            message: isHealthy ? 'SQS está funcionando' : 'Falha no SQS da VW-Autoservice'
        });

        if (isHealthy) return result;
        throw new HealthCheckError('Sqs inoperante', 'Falha no SQS da VW-Autoservice');
    }

    async isHealthyBull(key: string): Promise<HealthIndicatorResult> {
        const status = await this.autoservice.getBullMqStatus();
        console.log(status);
        const isHealthy = status.failed === 0;

        const result = this.getStatus(key, isHealthy, {
            status: isHealthy ? 'up' : 'down',
            message: isHealthy ? 'BullMQ funcionando e sem jobs com falha' : 'BullMq com jobs falhados'
        });

        if (isHealthy) return result;
        throw new HealthCheckError('BullMQ inoperante', 'Falha no BullMQ, o Redis está funcional?');
    }
}