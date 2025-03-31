import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LazyModuleLoader } from "@nestjs/core";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Interval } from "@nestjs/schedule";
import { Job, JobsOptions, Queue } from "bullmq";
import { UtilService } from "../util/util.service";
import { DateService } from "../util/date.service";

@Injectable()
export class QueueService implements OnApplicationBootstrap {
    public isBusy: boolean;

    constructor(
        private lazyModuleLoader: LazyModuleLoader,
        @InjectQueue('autoservice') private readonly autoservice: Queue,
        @InjectQueue('mainJobs') private readonly mainJobs: Queue,
        private readonly config: ConfigService,
        private readonly util: UtilService,
        private readonly eventEmitter: EventEmitter2,
        private readonly dates: DateService,
    ) { }

    public async onApplicationBootstrap() {
        await this.autoservice.drain();
        // console.log('fila drenada');
    }

    @Interval(10000)
    async retryFailedJobs() {
        const status = await this.getBullMqStatus();
        if (status.failed > 0) {
            const jobs = await this.autoservice.getFailed();
            for (let failedjob of jobs) {
                const job = await this.autoservice.getJob(failedjob.id);
                await job.retry();
            }
        }
        if (status.paused > 0) {
            const status = await this.autoservice.isPaused();
            if (status) {
                await this.autoservice.resume();
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
            const job = await this.autoservice.add(queue, data, options)
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
            const jobCounts = await this.autoservice.getJobCounts();
            console.log(jobCounts);
            return jobCounts;
        } catch (error) {
            console.log(error);
        }
    }

    public async addJobsToQueue(queue, data) {
        // Verifique se a fila está pausada
        const isPaused = await this[queue].isPaused();
        if (isPaused) {
            await this[queue].resume();
            console.log(`Fila ${queue} retomada para adicionar novo job`);
        }

        const job = await this[queue].add(queue, data, {
            delay: 5000,
            attempts: 10,
            backoff: 3,
            removeOnComplete: true
        });

        console.log(`Job adicionado à fila ${queue}: ${job.id}`);
        return job;
    }

    async checkQueue() {
        try {
            const isPaused = await this.autoservice.isPaused();
            const activeCount = await this.autoservice.getActiveCount();
            const waitingCount = await this.autoservice.getWaitingCount();

            // Se há jobs para processar e a fila está pausada, retome-a
            if ((activeCount > 0 || waitingCount > 0) && isPaused) {
                await this.autoservice.resume();
                console.log(`Fila retomada: ${activeCount} ativos, ${waitingCount} em espera`);
                this.isBusy = true;
            }
            // Se não há jobs e a fila está ativa, pause-a
            else if (activeCount === 0 && waitingCount === 0 && !isPaused) {
                await this.autoservice.pause();
                console.log('Fila pausada: sem jobs para processar');
                this.isBusy = false;
            }
        } catch (error) {
            console.error('Erro ao verificar a fila:', error);
        }
    }

    async handleQueue() {
        const isPaused = await this.autoservice.isPaused();
        if (isPaused) {
            await this.autoservice.resume();
            if (!(await this.autoservice.isPaused())) {
                return true;
            }
        } else {
            await this.autoservice.pause();
            if (await this.autoservice.isPaused()) {
                return false;
            }
        }
        return isPaused;
    }

    public async getActiveJobs(queue) {
        const activeJobs = await this[queue].getJobCounts();
        return activeJobs;
    }

    public async jobAlreadyAdded(queue, data) {
        // Obtenha os jobs em espera
        const waitingJobs = await this[queue].getJobs(['waiting']);

        // Verifique se algum job tem os mesmos dados
        for (const job of waitingJobs) {
            const jobData = job.data;
            if (jobData.startDate === data.startDate && jobData.endDate === data.endDate) {
                return true;
            }
        }

        return false;
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

    @OnEvent('mainjobs.complete')
    handleCompleteJobs(payload) {
        console.log('fila concluida MAINJOBS', payload);
        this.isBusy = false;
    }
}