import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { DateService } from '../util/date.service';

@Processor('monthly')
export class MonthlyConsumer extends WorkerHost {
    constructor(
        private readonly emitter: EventEmitter2,
        private readonly prisma: PrismaService,
        private readonly dates: DateService,
    ) {
        super()
    }
    async process(job: Job<any, any, string>): Promise<any> {
        let progress = 0;
        for (let i = 0; i < 100; i++) {
            // console.log(job.data);
            // console.log('monthly', i);
            progress += 1;
            await job.updateProgress(progress);
        }
        return {};
    }

    @OnWorkerEvent('completed')
    async onCompleted(job: Job) {
        // console.log(`Job monthly ${job.data.year} ${job.data.month} ${job.id} completed.`);
        this.emitter.emit('month.job.complete', { id: job.id, status: true });
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