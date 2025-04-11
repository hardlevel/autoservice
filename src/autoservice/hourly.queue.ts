import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { DateService } from '../util/date.service';
import { AutoserviceService } from './autoservice.service';
import { QueueService } from './queue.service';
import { StateService } from './state.service';

@Processor('hourly')
export class HourlyConsumer extends WorkerHost {
    constructor(
        private readonly emitter: EventEmitter2,
        private readonly prisma: PrismaService,
        private readonly dates: DateService,
        private readonly autoservice: AutoserviceService,
        private readonly queue: QueueService,
        private readonly state: StateService,
    ) {
        super()
    }
    async process(job: Job<any, any, string>): Promise<any> {
        let progress = 0;
        const { year, month, day, hour, minute } = job.data;
        const { startDate, endDate } = this.dates.getDatesFormatMinutes(year, month, day, hour, minute);
        // await this.queue.autoserviceIsActive();
        // await this.emitter.waitFor('autoservice.empty');
        // await this.autoservice.waitForSqsAndBullEmpty(10000);
        // await this.autoservice.waitForSqsAndBullEmpty(10000);
        // if (!this.state.checkState()) {
        //     await this.state.waitAppFree();
        // }
        await this.emitter.waitFor('app.free');
        console.log('hour', startDate);
        // await this.autoservice.waitForSqsAndBullEmpty();
        await this.emitter.emit('updateDates', { startDate, endDate });
        // while (true) {
        //     const status = await this.queue.getAutoserviceStatus();
        //     if (status.active === 0 && status.waiting === 0) {
        //         // Aguarda 10s e confirma de novo
        //         await new Promise(r => setTimeout(r, 10000));
        //         const doubleCheck = await this.queue.getAutoserviceStatus();
        //         if (doubleCheck.active === 0 && doubleCheck.waiting === 0) break;
        //     }
        //     await new Promise(r => setTimeout(r, 5000));
        // }
        const result = await this.autoservice.makeRequest(startDate, endDate);
        // await this.emitter.emit('waiting.complete');
        await this.emitter.emit('waiting.messages');

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
        console.log(`Job ${job.id} completed.`);
        // const last = await this.prisma.findOne(1, 'lastSearch');
        // console.log('ultima pesquisa', last);
        // await this.sqs.isSqsActiveAndEmpty();
        // this.eventEmitter.emit('autoservice.complete', { id: job.id, status: true });
        this.emitter.emit('job.completed', { id: job.id, status: true });
        this.emitter.emit('bull.state', { state: 'free' });
    }

    @OnWorkerEvent('ready')
    handleReady(job: Job) {
        console.log(`Job autoservice ${job} is ready.`);
        this.emitter.emit('bull.state', { state: 'busy' });
    }

    @OnWorkerEvent('active')
    handleActive(job: Job) {
        console.log(`Job ${job.id} is active.`);
        // this.eventEmitter.emit('autoservice.active', { id: job.id, status: true });
        this.emitter.emit('bull.state', { state: 'busy' });
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job, error: Error) {
        console.error(`Job ${job.id} failed.`, error.message);
        console.log(error);
        // this.jobLog.ended_at = new Date();
        // this.jobLog.status = "FAILED";
        // this.jobLog.message = error.message;
        // this.jobLog.data = job.data;
        // this.jobLog.startDate = job.data.startDate;
        // this.jobLog.endDate = job.data.endDate;
        this.emitter.emit('bull.state', { state: 'free' });
        // await this.prisma.jobLogs.create({
        //     data: this.jobLog
        // })
    }

    async isLast(data) {
        const { startDate, endDate } = data;
        if (endDate.includes('T23:59:59')) {
            const date = this.dates.getDateObject(endDate);
            console.log('ultimo horario', date);
        }
    }
}