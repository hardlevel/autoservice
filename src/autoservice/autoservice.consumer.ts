import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DateService } from '../util/date.service';
import { AutoserviceService } from './autoservice.service';
import { firstValueFrom, retry, delay, catchError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { access } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { UtilService } from '../util/util.service';

interface TokenBody {
    client_id: string;
    client_secret: string;
    grant_type: string;
}

@Processor('mainProcess')
export class AutoserviceConsumer extends WorkerHost {
    constructor(
        private readonly dates: DateService,
        private readonly autoservice: AutoserviceService,
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
        private readonly util: UtilService
    ) { super() }

    async process(job: Job<any, any, string>): Promise<any> {
        let progress = 0;
        const { year, month } = job.data;

        await this.dates.processYear(year, month, this.main);
    }

    async main(startDate, endDate) {
        const { access_token } = await this.getToken();
        try {
            while (!this.autoservice.sqsEmpty) {
                console.log("SQS ainda processando mensagens...");
                await this.util.timer(3, "Aguardando SQS processar mensagens...");
            }

            while (this.autoservice.isBusy) {
                await this.autoservice.checkQueue();
                await this.util.timer(3, "Fila do BullMQ ocupada, aguardando...");
            }
            await this.makeRequest(access_token, startDate, endDate);
        } catch (error) {
            this.autoservice.setLog('error', 'Falha ao solicitar dados da API do autoservice', error.message);
        }
    }

    async getToken() {
        const { apiId: client_id, apiSecret: client_secret, url } = this.config.get('token');
        const body: TokenBody = {
            client_id,
            client_secret,
            grant_type: 'client_credentials'
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(url, body, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }),
            );
            return response.data;
        } catch (error) {
            throw new Error('Error obtaining access token');
        }
    }

    async makeRequest(access_token: string, dataInicio: string, dataFim: string) {
        const { url } = this.config.get('api');

        try {
            if (!access_token) throw new BadRequestException('Access Token não informado');
            if (!dataInicio || !dataFim) throw new BadRequestException('Datas de início e fim não informadas');

            const response = await firstValueFrom(
                this.httpService.get(url, {
                    params: { dataInicio, dataFim },
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }).pipe(
                    retry({
                        count: Infinity,
                        delay: 30000,
                    }),
                    catchError((error: AxiosError) => {
                        this.autoservice.setLog(
                            'error',
                            'Falha ao solicitar dados da API Autoservice',
                            error.message,
                            dataInicio,
                            dataFim
                        );
                        throw new BadRequestException('Falha ao solicitar dados da API Autoservice');
                    }),
                ),
            );
        } catch (error) {
            throw new Error('Error obtaining access token: ' + error.message);
        }
    }
}
