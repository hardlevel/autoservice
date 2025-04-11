import { InjectFlowProducer, InjectQueue } from "@nestjs/bullmq";
import { forwardRef, Inject, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LazyModuleLoader } from "@nestjs/core";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { FlowProducer, Job, JobsOptions, Queue } from "bullmq";
import { UtilService } from "../util/util.service";
import { DateService } from "../util/date.service";
import { AutoserviceService } from "./autoservice.service";

@Injectable()
export class QueueService implements OnApplicationBootstrap {
    public isBusy: boolean;
    public newMessage: boolean;

    constructor(
        private lazyModuleLoader: LazyModuleLoader,
        @InjectQueue('autoservice') private readonly autoservice: Queue,
        @InjectQueue('daily') private readonly daily: Queue,
        @InjectQueue('monthly') private readonly monthly: Queue,
        @InjectQueue('hourly') private readonly hourly: Queue,
        @InjectFlowProducer('autoserviceFlow') private readonly flow: FlowProducer,
        private readonly config: ConfigService,
        private readonly util: UtilService,
        private readonly eventEmitter: EventEmitter2,
        private readonly dates: DateService,
        private readonly scheduler: SchedulerRegistry,
        @Inject(forwardRef(() => AutoserviceService)) private readonly autoserviceService: AutoserviceService,
    ) { }

    public async onApplicationBootstrap() {
        await this.autoservice.drain();
        await this.daily.drain();
        await this.monthly.drain();
        await this.hourly.drain();
        console.log('fila drenada');
    }

    @Interval(100000)
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

    // @Interval(5000)
    // async isQueueActive(queue) {
    //     const status = await this.autoservice.isPaused();
    //     const status2 = await this.autoservice.getActive();
    //     // await this.autoservice.retryJobs();
    //     console.log(await this.daily.isPaused(), await this.daily.getActiveCount(), await this.daily.getJobCounts());
    //     console.log(status, status2, await this.autoservice.getJobCounts());
    // }

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

    public async bulkAddJobs(queue, data) {
        return this[queue].addBulk(data);
    }

    // @Interval(60000)
    // testQueue() {
    //     this.checkQueue();
    // }

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
        // const isPaused = await this[queue].isPaused();
        // if (isPaused) {
        //     await this[queue].resume();
        //     console.log(`Fila ${queue} retomada para adicionar novo job`);
        // }

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

    public async manageFlow(
        year: number = 2024,
        month: number = 1,
        day: number = 1,
        hour: number = 0,
        minute: number = 0,
        second: number = 0
    ) {
        const daysInMonth = this.dates.daysInMonth(year, month);

        // Gerar os jobs `daily`, cada um com filhos por hora
        const dailyJobs = [];
        for (let d = day; d <= daysInMonth; d++) {
            const hourlyJobs = [];

            for (let h = hour; h < 24; h++) {
                hourlyJobs.push({
                    name: `hour-${d}-${h}`,
                    queueName: 'hourly',
                    jobId: `${year}-${month}-${d}-${h}`,
                    data: {
                        year,
                        month,
                        day: d,
                        hour: h,
                        step: `process hour ${h} for day ${d}`,
                    },
                });
            }

            dailyJobs.push({
                name: `daily-${d}`,
                queueName: 'daily',
                jobId: `${year}-${month}-${d}`,
                data: { year, month, day: d, step: `process daily ${d}` },
                children: hourlyJobs,
            });
        }

        const flow = await this.flow.add({
            name: 'autoserviceFlow',
            queueName: 'autoserviceFlow',
            data: { year, month, day, hour, minute, second },
            children: [
                {
                    name: `monthly-${year}-${month}`,
                    queueName: 'monthly',
                    data: { year, month, step: `${year}-${month} monthly process start` },
                    children: dailyJobs,
                },
            ],
        });
        // console.log('flow', flow);
        return flow;
    }


    public async getAutoserviceStatus() {
        const status = await this.autoservice.getJobCounts();
        console.log('status', status);
        return status;
    }

    public async autoserviceIsActive() {
        const { active, waiting, delayed } = await this.getAutoserviceStatus();
        if (active > 0 || waiting > 0 || delayed > 0) {
            return true;
        }
        this.eventEmitter.emit('autoservice.empty');
        return
    }


    // @Interval(10000)
    // public async monitorAutoserviceQueue() {
    //     while (true) {
    //         const status = await this.getAutoserviceStatus();

    //         if (status.failed > 0) {
    //             await this.autoservice.retryJobs({ state: 'failed' });
    //         }

    //         if (status.active === 0 && status.waiting === 0 && status.delayed === 0) {
    //             console.log('Possível finalização detectada, aguardando mais 10s para confirmar...');
    //             await new Promise(resolve => setTimeout(resolve, 10000));
    //             // addTimeout('autoserviceConfirm', 10000) {
    //             //TODO implementar segunda checagem de 20 segundos, se receber um sinal, abort ou evento de nova mensagem, sair do loop
    //             //Testar usar decorador onevent acima do timeout
    //             // }

    //             // }
    //             const secondCheck = await this.getAutoserviceStatus();
    //             if (secondCheck.active === 0 && secondCheck.waiting === 0 && secondCheck.delayed === 0) {
    //                 console.log('Fila confirmadamente finalizada!');
    //                 break;
    //             } else {
    //                 console.log('Fila ainda em andamento após segunda checagem. Continuando monitoramento...');
    //             }
    //         }

    //         await this.eventEmitter.emit('autoservice.working');
    //         await new Promise(resolve => setTimeout(resolve, 5000));
    //     }

    //     await this.eventEmitter.emit('autoservice.complete');
    // }

    @OnEvent('autoservice.active')
    async startMonitoringQueue() {
        await this.hourly.pause();
        await this.autoserviceService.waitForSqsAndBullEmpty(10000);
        this.eventEmitter.emit('autoservice.final-check');
    }

    @OnEvent('autoservice.final-check')
    async finalMonitoringQueue() {
        await this.hourly.pause();

        let isEmpty = false;
        while (!isEmpty) {
            const status = await this.getAutoserviceStatus();
            isEmpty = status.active === 0 && status.waiting === 0 && status.delayed === 0 && !this.newMessage;

            if (!isEmpty) {
                await new Promise((res) => setTimeout(res, 10000));
            }
        }

        this.eventEmitter.emit('autoservice.complete');
    }


    @OnEvent('sqsEmpty')
    async handleSqsEmpt() {
        this.newMessage = false;
    }

    @OnEvent('autoservice.complete')
    async handleAutoserviceComplete() {
        console.log('Fila concluída!');
        this.hourly.resume();
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

    @OnEvent('daily.job.complete')
    async handleDailyComplete(payload) {
        const dailyStatus = await this.daily.getActiveCount();
        const jobs = await this.daily.getJobCounts();
        // console.log('dailyStatus', dailyStatus, jobs);
    }

    @OnEvent('test.job.complete')
    async handleTestComplete(payload) {
        const dailyStatus = await this.daily.getActiveCount();
        const jobs = await this.daily.getJobCounts();
        // console.log('testStatus', dailyStatus, jobs);
    }

    @OnEvent('sqsMessage')
    newMessageArrived() {
        this.newMessage = true;
    }
}