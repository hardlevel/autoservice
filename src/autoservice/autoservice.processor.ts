import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as fs from 'fs'; // Para usar métodos baseados em promises
import * as path from 'path';
import { AutoserviceService } from './autoservice.service';
import { PrismaService } from '../prisma/prisma.service';
import { Ck3Service } from './ck3.service';
import { Ck4Service } from './ck4.service';
// import { Ck5Service } from './ck5.service';
import { Ck6Service } from './ck6.service';
import { Ck7Service } from './ck7.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from '../all.exceptions';
@Processor('autoservice')
export class AutoserviceProcessor extends WorkerHost {
    constructor(
        private readonly autoservice: AutoserviceService,
        private readonly prisma: PrismaService,
        private readonly ck3Service: Ck3Service,
        private readonly ck4service: Ck4Service,
        // private readonly ck5service: Ck5Service,
        private readonly ck6service: Ck6Service,
        private readonly ck7service: Ck7Service,
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
        try {
            if (ck == 'CK3001') {
                console.log('ck3001 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    this.ck3Service.ck3001(item);
                }
            }

            if (ck == 'CK4001') {
                console.log('ck4001 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    await this.ck4service.ck4001(item);
                }
            }

            if (ck == 'CK5001') {
                console.log('ck5001 idendificado! Total de registros:', data[ck].length);
                console.log(data[ck]);
                // await this.autoservice.ck5(data);
            }

            if (ck == 'CK6011') {
                console.log('ck6011 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    await this.ck6service.ck6011(item);
                }
            }

            if (ck == 'CK7001') {
                console.log('ck7001 idendificado! Total de registros:', data[ck].length);
                for (const item of data[ck]) {
                    await this.ck7service.ck7001(item);
                }
            }


            return { success: true };
        } catch (error) {
            console.log('Erro ao processar arquivos', error);
            // throw new AllExceptionsFilter();
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