import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { DateService } from '../util/date.service';
import { AutoserviceService } from './autoservice.service';
import { QueueService } from './queue.service';

@Processor('hourly')
export class HourlyConsumer extends WorkerHost {
    constructor(
        private readonly emitter: EventEmitter2,
        private readonly prisma: PrismaService,
        private readonly dates: DateService,
        private readonly autoservice: AutoserviceService,
        private readonly queue: QueueService,
    ) {
        super()
    }
    async process(job: Job<any, any, string>): Promise<any> {
        let progress = 0;
        console.log('hour', job.data);
        const { year, month, day, hour } = job.data;
        const { startDate, endDate } = this.dates.getDatesFormat(year, month, day, hour);
        await this.emitter.waitFor('autoservice.complete');
        await this.emitter.emit('updateDates', { startDate, endDate });
        while (true) {
            const status = await this.queue.getAutoserviceStatus();
            if (status.active === 0 && status.waiting === 0) {
                // Aguarda 10s e confirma de novo
                await new Promise(r => setTimeout(r, 10000));
                const doubleCheck = await this.queue.getAutoserviceStatus();
                if (doubleCheck.active === 0 && doubleCheck.waiting === 0) break;
            }
            await new Promise(r => setTimeout(r, 5000));
        }
        const result = await this.autoservice.makeRequest(startDate, endDate);

        for (let i = 0; i < 100; i++) {
            // console.log(job.data);
            // console.log('teste', i);
            progress += 1;
            await job.updateProgress(progress);
        }


        // let attempts = 10;
        // while (attempts--) {
        //     const status = await this.queue.getAutoserviceStatus();
        //     console.log('Status', status);
        //     await new Promise(resolve => setTimeout(resolve, 3000));
        // }

        // await new Promise(resolve => setTimeout(resolve, 5000));

        return { status: 'done' };
    }

    @OnWorkerEvent('completed')
    async onCompleted(job: Job) {
        // console.log(`Job ${job.id} completed.`);
        // console.log(`Job hour ${job.data.year} ${job.data.month} ${job.data.day} ${job.data.hour} completed.`);
        this.emitter.emit('hourly.job.complete', { id: job.id, status: true });
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