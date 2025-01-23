import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as fs from 'fs'; // Para usar métodos baseados em promises
import * as path from 'path';
import { AutoserviceService } from './autoservice.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Processor('pastData')
export class PastDataProcessor extends WorkerHost {
    constructor(
        private readonly autoservice: AutoserviceService,
        private readonly prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>) {
        // console.log('Processing job:', job.id, job.data);
        const data = job.data;
        const ck = Object.keys(data)[0];
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
        const last = await this.prisma.findOne(1, 'lastSearch');
        console.log('ultima pesquisa', last);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        console.error(`Job ${job.id} failed.`, error.message);
        console.log(error);
        throw new HttpException('Erro ao processar dados', HttpStatus.BAD_REQUEST);
        // throw new HttpException(error, HttpStatus.BAD_REQUEST);
        // throw new HttpException('Erro personalizado', HttpStatus.BAD_REQUEST);
    }
}