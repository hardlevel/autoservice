import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { DateService } from '../../util/date.service';

@Processor('daily')
export class DailyConsumer extends WorkerHost {
    constructor(
        private readonly emitter: EventEmitter2,
        private readonly prisma: PrismaService,
        private readonly dates: DateService,
    ) {
        super()
    }
    async process(job: Job<any, any, string>): Promise<any> {
        try {
            // const result = await this.autoservice.makeRequest()
            return {};
        } catch (err) {
            console.error('Erro em daily:', err);
            throw err;
        }
    }

    @OnWorkerEvent('completed')
    async onCompleted(job: Job) {
        // console.log(`daily finalizado ${job.data.year} ${job.data.month} ${job.data.day} completed.`);
        // console.log(`Job ${job.id} completed.`);
        this.emitter.emit('daily.job.complete', { id: job.id, status: true });
        // await this.isLast(job.data);
    }

    async isLast(data) {
        const { startDate, endDate } = data;
        if (endDate.includes('T23:59:59')) {
            const date = this.dates.getDateObject(endDate);
            console.log('ultimo horario', date);
        }
    }
}