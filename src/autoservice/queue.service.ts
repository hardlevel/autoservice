import { Message } from "@aws-sdk/client-sqs";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LazyModuleLoader } from "@nestjs/core";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Interval } from "@nestjs/schedule";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { Job, JobsOptions, Queue } from "bullmq";
import { UtilService } from "../util/util.service";
import { DateService } from "../util/date.service";

@Injectable()
export class QueueService implements OnApplicationBootstrap {
    public isBusy: boolean;

    constructor(
        private lazyModuleLoader: LazyModuleLoader,
        @InjectQueue('autoservice') private readonly autoserviceQueue: Queue,
        private readonly config: ConfigService,
        private readonly util: UtilService,
        private readonly eventEmitter: EventEmitter2,
        private readonly dates: DateService,
    ) { }

    public async onApplicationBootstrap() {
        await this.autoserviceQueue.drain();
        console.log('fila drenada');
    }

    @Interval(10000)
    async retryFailedJobs() {
        const status = await this.getBullMqStatus();
        if (status.failed > 0) {
            const jobs = await this.autoserviceQueue.getFailed();
            for (let failedjob of jobs) {
                const job = await this.autoserviceQueue.getJob(failedjob.id);
                await job.retry();
            }
        }
        if (status.paused > 0) {
            const status = await this.autoserviceQueue.isPaused();
            if (status) {
                await this.autoserviceQueue.resume();
            }
        }
    }

    protected async addJobToQueue(queue: string, data: any): Promise<Job> {
        try {
            const options: JobsOptions = {
                delay: 5000,
                attempts: 10,
                backoff: 3,
                removeOnComplete: true
            }
            const job = await this.autoserviceQueue.add(queue, data, options)
            return job;
        } catch (error) {
            console.error(error);
        }
    }

    @Interval(60000)
    testQueue() {
        this.checkQueue();
    }

    async getBullMqStatus() {
        try {
            const jobCounts = await this.autoserviceQueue.getJobCounts();
            console.log(jobCounts);
            return jobCounts;
        } catch (error) {
            console.log(error);
        }
    }

    public async addJobsToQueue(queue, data) {
        return this.autoserviceQueue.add(queue, data, {
            delay: 5000,
            attempts: 10,
            backoff: 3,
            removeOnComplete: true
        });
    }

    async checkQueue() {
        try {
            const activeCount = await this.autoserviceQueue.getActiveCount();
            const waitingCount = await this.autoserviceQueue.getWaitingCount();

            if (activeCount === 0 && waitingCount === 0) {
                console.warn(`Nenhuma tarefa ativa. Pausando a fila...`);
                const wasPaused = await this.handleQueue();  // Usando handleQueue para pausar
                if (wasPaused !== false) {
                    this.isBusy = false;
                }
            } else {
                const wasResumed = await this.handleQueue();  // Usando handleQueue para retomar
                if (activeCount === 0) {
                    if (wasResumed === true) {
                        await this.autoserviceQueue.pause();
                    }
                }
                console.log(`Fila ativa: ${activeCount} tarefas em execução.`);
            }
        } catch (error) {
            console.error('Erro ao verificar a fila:', error);
        }
        return;
    }

    async handleQueue() {
        const isPaused = await this.autoserviceQueue.isPaused();
        if (isPaused) {
            await this.autoserviceQueue.resume();
            if (!(await this.autoserviceQueue.isPaused())) {
                return true;
            }
        } else {
            await this.autoserviceQueue.pause();
            if (await this.autoserviceQueue.isPaused()) {
                return false;
            }
        }
        return isPaused;
    }

    @OnEvent('autoservice.*')
    handleOrderEvents(payload) {
        console.log(payload);
    }

    @OnEvent('autoservice.working')
    handleWorking(payload) {
        this.isBusy = true;
    }

    @OnEvent('autoservice.complete')
    handleComplete(payload) {
        console.log('fila concluida', payload);
        this.isBusy = false;
    }
}