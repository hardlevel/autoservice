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
import { StateService } from "./state.service";

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
        // @Inject(forwardRef(() => AutoserviceService)) private readonly autoserviceService: AutoserviceService,
    ) { }

    public async onApplicationBootstrap() {
        await this.autoservice.drain();
        await this.daily.drain();
        await this.monthly.drain();
        await this.hourly.drain();
        console.log('filas drenadas');
        // await this.isQueueActive('autoservice');
    }

    @Interval(100000)
    async retryFailedJobs() {
        const { failed, paused } = await this.getQueueStatus('autoservice');
        if (failed > 0) {
            const jobs = await this.autoservice.getFailed();
            for (let failedjob of jobs) {
                const job = await this.autoservice.getJob(failedjob.id);
                await job.retry();
            }
        }
        if (paused > 0) {
            const status = await this.autoservice.isPaused();
            if (status) {
                await this.autoservice.resume();
            }
        }
    }

    public async waitForQueueEmpty(queue) {
        let isEmpty = false;
        while (!isEmpty) {
            isEmpty = await this.isQueueActive(queue);
            if (!isEmpty) {
                await this.eventEmitter.emit('state.change', { state: false });
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }
        }
    }

    public async addJobToQueue(queue: string, data: any): Promise<Job> {
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

    private async handleQueue() {
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

    public async getQueueStatus(queue) {
        const activeJobs = await this[queue].getJobCounts();
        return activeJobs;
    }

    public async isQueueActive(queue) {
        const { active, waiting, delayed } = await this.getQueueStatus(queue);
        const isActive = active > 0 || waiting > 0 || delayed > 0;
        return isActive;
    }

    public async jobAlreadyAdded(queue, data) {
        const waitingJobs = await this[queue].getJobs(['waiting']);
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
        second: number = 0,
        interval: string = '1h'
    ) {
        const daysInMonth = this.dates.daysInMonth(year, month);
        const dailyJobs = [];

        for (let d = day; d <= daysInMonth; d++) {
            const hourlyJobs = [];

            // Define valores iniciais de hora/minuto só para o primeiro dia
            const startHour = d === day ? hour : 0;
            const endHour = 24;

            for (let h = startHour; h < endHour; h++) {
                const startMinute = d === day && h === hour ? minute : 0;

                for (let m = startMinute; m < 60; m += 10) {
                    hourlyJobs.push({
                        name: `hour-${d}-${h}-${m}`,
                        jobId: `${year}-${month}-${d}-${h}-${m}`,
                        queueName: 'hourly',
                        data: {
                            year,
                            month,
                            day: d,
                            hour: h,
                            minute: m,
                            step: `process hour ${h} for day ${d}`,
                        },
                    });
                }
            }

            dailyJobs.push({
                name: `daily-${d}`,
                queueName: 'daily',
                jobId: `${year}-${month}-${d}`,
                data: {
                    year,
                    month,
                    day: d,
                    step: `process daily ${d}`,
                },
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
                    jobId: `${year}-${month}`,
                    data: { year, month, step: `process monthly ${month}` },
                    children: dailyJobs,
                },
            ],
        });

        return flow;
    }

    @OnEvent('queue.start')
    async onAppStart() {
        const status = await this.isQueueActive('autoservice');
        const state = status ? 'busy' : 'free';
        this.eventEmitter.emit('bull.state', { type: 'queue', name: 'autoservice', state });
    }
}