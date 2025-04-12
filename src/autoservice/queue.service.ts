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
        private readonly emitter: EventEmitter2,
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
        if (!this[queue] || typeof this[queue].getJobCounts !== 'function') {
            throw new Error(`Queue "${queue}" not found or is invalid`);
        }
        let notified = false;
        while (await this.isQueueActive(queue)) {
            if (!notified) {
                this.emitter.emit('state.change', { state: false });
                notified = true;
            }
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    }

    public async addJobToQueue(queue: string, data: any): Promise<Job> {
        try {
            const options: JobsOptions = {
                delay: 5000,
                attempts: 10,
                backoff: 3,
                removeOnComplete: true,
                removeOnFail: false,
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
        return active > 0 || waiting > 0 || delayed > 0;
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

            const startHour = d === day ? hour : 0;
            const endHour = 24;

            for (let h = startHour; h < endHour; h++) {
                const startMinute = d === day && h === hour ? minute : 0;

                for (let m = startMinute; m < 60; m += 10) {
                    const data = { year, month, day: d, hour: h, minute: m, step: `process hour ${h} for day ${d}` };
                    await this.addJobToQueue('hourly', data);
                    // hourlyJobs.push({
                    //     name: `hour-${d}-${h}-${m}`,
                    //     queueName: 'hourly',
                    //     data: {
                    //         year,
                    //         month,
                    //         day: d,
                    //         hour: h,
                    //         minute: m,
                    //         step: `process hour ${h} for day ${d}`,
                    //     },
                    //     opts: {
                    //         removeOnComplete: true,
                    //         removeOnFail: false,
                    //     },
                    // });
                }
            }

            // dailyJobs.push({
            //     name: `daily-${d}`,
            //     queueName: 'daily',
            //     data: {
            //         year,
            //         month,
            //         day: d,
            //         step: `process daily ${d}`,
            //     },
            //     opts: {
            //         removeOnComplete: true,
            //         removeOnFail: false,
            //     },
            //     children: hourlyJobs,
            // });
        // }

        // const flow = await this.flow.add({
        //     name: 'autoserviceFlow',
        //     queueName: 'autoserviceFlow',
        //     data: { year, month, day, hour, minute, second },
        //     children: [
        //         {
        //             name: `monthly-${year}-${month}`,
        //             queueName: 'monthly',
        //             data: { year, month, step: `process monthly ${month}` },
        //             opts: {
        //                 removeOnComplete: true,
        //                 removeOnFail: false,
        //             },
        //             children: dailyJobs,
        //         },
        //     ],
        // });

        // return flow;
        }
    }

    @OnEvent('queue.start')
    async onAppStart() {
        const status = await this.isQueueActive('autoservice');
        // const state = status ? 'busy' : 'free';
        // this.emitter.emit('bull.state', { type: 'queue', name: 'autoservice', state });
        status ? this.emitter.emit('bull.busy') : this.emitter.emit('bull.free');
        console.log(`📦 Fila autoservice está ${status ? 'ativa (busy)' : 'inativa (free)'}`);
    }
}