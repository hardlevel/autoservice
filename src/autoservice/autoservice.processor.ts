import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as fs from 'fs'; // Para usar métodos baseados em promises
import * as path from 'path';
import { AutoserviceService } from './autoservice.service';
import { PrismaService } from '../prisma/prisma.service';
import { Ck3Service } from './ck3.service';
import { Ck4Service } from './ck4.service';
import { Ck5Service } from './ck5.service';
import { Ck6Service } from './ck6.service';
import { Ck7Service } from './ck7.service';
import { HttpException, HttpStatus, Logger, LoggerService } from '@nestjs/common';
import { AllExceptionsFilter } from '../common/errors/all.exceptions';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
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
@Processor('autoservice')
export class AutoserviceProcessor extends WorkerHost {
    category;
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
        private readonly prisma: PrismaService,
        private readonly eventEmitter: EventEmitter2,
        private readonly ck3Service: Ck3Service,
        private readonly ck4service: Ck4Service,
        private readonly ck5service: Ck5Service,
        private readonly ck6service: Ck6Service,
        private readonly ck7service: Ck7Service,
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

        if (data) {
            this.eventEmitter.emit('autoservice.working', { id: job.id, status: true });
        }
        // const filePath = path.join(process.cwd(), `${ck}.json`);
        // console.log(ck, filePath);
        // console.log(ck);
        // this.addOrCreateJsonFile(filePath, data);
        // console.log(data.CK3001);
        //mock data
        // data.forEach(item => {
        //     const ck3001Array = item.CK3001;
        //     ck3001Array.forEach(file => {
        //         this.ck3Service.ck3001(file);
        //     })
        // })

        try {
            if (ck == 'CK3001') {
                console.log('ck3001 idendificado! Total de registros:', data[ck].length);
                this.category = ck;
                for (const item of data[ck]) {
                    await this.ck3Service.ck3001(item, data.startDate, data.endDate);
                }
                this.ckLog.startDate = data.startDate;
                this.ckLog.endDate = data.endDate;
                this.ckLog.jobId = parseInt(job.id);
                this.ckLog.status = 'OK';
                this.ckLog.category = ck;
                this.ckLog.qtd = data[ck].length
                // await this.prisma.ckLogs.create({
                //     data: this.ckLog
                // })
                // await this.recordDaily(year, month, day, 'ck3001', data[ck].length);
            }

            if (ck == 'CK4001') {
                console.log('ck4001 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    await this.ck4service.ck4001(item, data.startDate, data.endDate);
                }
                this.ckLog.startDate = data.startDate;
                this.ckLog.endDate = data.endDate;
                this.ckLog.jobId = parseInt(job.id);
                this.ckLog.status = 'OK';
                this.ckLog.category = ck;
                this.ckLog.qtd = data[ck].length
                // await this.prisma.ckLogs.create({
                //     data: this.ckLog
                // })
                // await this.recordDaily(year, month, day, 'ck4001', data[ck].length);
            }

            if (ck == 'CK5001') {
                console.log('ck5001 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    await this.ck5service.ck5001(item, data.startDate, data.endDate);
                }
                this.ckLog.startDate = data.startDate;
                this.ckLog.endDate = data.endDate;
                this.ckLog.jobId = parseInt(job.id);
                this.ckLog.status = 'OK';
                this.ckLog.category = ck;
                this.ckLog.qtd = data[ck].length
                // await this.prisma.ckLogs.create({
                //     data: this.ckLog
                // })
                // await this.recordDaily(year, month, day, 'ck5001', data[ck].length);
            }

            if (ck == 'CK6011') {
                console.log('ck6011 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    await this.ck6service.ck6011(item, data.startDate, data.endDate);
                }
                this.ckLog.startDate = data.startDate;
                this.ckLog.endDate = data.endDate;
                this.ckLog.jobId = parseInt(job.id);
                this.ckLog.status = 'OK';
                this.ckLog.category = ck;
                this.ckLog.qtd = data[ck].length
                // await this.prisma.ckLogs.create({
                //     data: this.ckLog
                // })
                // await this.recordDaily(year, month, day, 'ck6011', data[ck].length);
            }

            if (ck == 'CK7001') {
                console.log('ck7001 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    await this.ck7service.ck7001(item, data.startDate, data.endDate);
                }
                this.ckLog.startDate = data.startDate;
                this.ckLog.endDate = data.endDate;
                this.ckLog.jobId = parseInt(job.id);
                this.ckLog.status = 'OK';
                this.ckLog.category = ck;
                this.ckLog.qtd = data[ck].length
                // await this.prisma.ckLogs.create({
                //     data: this.ckLog
                // })
                // await this.recordDaily(year, month, day, 'ck7001', data[ck].length);
            }

            return { success: true };
        } catch (error) {
            console.error('Erro ao processar arquivos', error, 'dados: ');
            // throw new AllExceptionsFilter();
            Logger.debug(`Processando dados no dia ${data.dataInicio} - ${data.dataFim} \n dados: ${data}`);
            // throw new Error(error.message);
        }
    }

    teste(data) {
        console.log(data);
    }

    descructData(data, fields) {
        fields.forEach(field => {

        })
        return { fields } = data;
    }

    @OnWorkerEvent('completed')
    async onCompleted(job: Job) {
        console.log(`Job ${job.id} completed.`);
        // const last = await this.prisma.findOne(1, 'lastSearch');
        // console.log('ultima pesquisa', last);
        this.eventEmitter.emit('autoservice.complete', { id: job.id, status: true });
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

    addOrCreateJsonFile(filePath, newData) {
        try {
            if (fs.existsSync(filePath)) {
                // Arquivo existe, lê o conteúdo atual
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const existingData = JSON.parse(fileContent);

                // Adiciona o novo conteúdo ao existente
                const updatedData = Array.isArray(existingData)
                    ? [...existingData, newData]
                    : [existingData, newData];

                fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
                console.log('Conteúdo adicionado ao arquivo existente.');
            } else {
                // Arquivo não existe, cria com o novo conteúdo
                const initialData = [newData]; // Inicializa como array
                fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
                console.log('Arquivo criado com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao manipular o arquivo JSON:', error.message);
        }
    }
}