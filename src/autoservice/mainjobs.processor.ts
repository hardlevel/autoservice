import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as fs from 'fs'; // Para usar métodos baseados em promises
import { AutoserviceService } from './autoservice.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { UtilService } from '../util/util.service';

interface JobLog {
    jobId: number;
    started_at: Date;
    ended_at: Date | null;
    startDate: string;
    endDate: string;
    status: string;
    message: string;
    data: string;
}

interface CkLog {
    startDate: string;
    endDate: string;
    category: string;
    data?: string;
    qtd?: number;
    status: string;
    message?: string;
    jobId: number
}
@Processor('mainJobs')
export class AutoserviceProcessor extends WorkerHost {
    category;
    processados;
    ckLog: CkLog = {
        startDate: '',
        endDate: '',
        category: '',
        // data: '',
        // qtd: 0,
        status: 'OK',
        // message: 'OK',
        jobId: 0
    };

    jobLog: JobLog = {
        jobId: 0,
        started_at: new Date(),
        ended_at: null,
        startDate: '',
        endDate: '',
        status: '',
        message: '',
        data: '',
    };

    constructor(
        private readonly autoservice: AutoserviceService,
        private readonly eventEmitter: EventEmitter2,
        private readonly util: UtilService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>) {
        // console.log('Processing job:', job.id, job.data);
        const data = job.data;
        const ck = Object.keys(data)[0];
        const date = moment();
        const day = date.date();
        const month = date.month();
        const year = date.year();
        console.log(job.data.startDate, job.data.endDate);
        this.jobLog = {
            jobId: parseInt(job.id),
            started_at: new Date(),
            ended_at: new Date(),
            startDate: job.data.startDate,
            endDate: job.data.endDate,
            status: 'OK',
            message: 'OK',
            data: 'OK'
        }
        console.log('Executando tarefa a partir da fila', job.data.startDate);

        setTimeout(() => console.log('aguardando'), 10000);
        await this.autoservice.mainProcess(job.data.startDate, job.data.endDate);
    }

    @OnWorkerEvent('completed')
    async onCompleted(job: Job) {
        console.log(`Job ${job.id} completed. Fila MAINJOBS`);
        // const last = await this.prisma.findOne(1, 'lastSearch');
        // console.log('ultima pesquisa', last);
        this.eventEmitter.emit('mainjobs.complete', { id: job.id, status: true });
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job, error: Error) {
        console.error(`Job ${job.id} failed.`, error.message);
        console.log(error);
        this.jobLog.ended_at = new Date();
        this.jobLog.status = "FAILED";
        this.jobLog.message = error.message;
        this.jobLog.data = job.data;
        this.jobLog.startDate = job.data.startDate;
        this.jobLog.endDate = job.data.endDate;

        // await this.prisma.jobLogs.create({
        //     data: this.jobLog
        // })
    }
}