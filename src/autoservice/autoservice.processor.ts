import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('autoservice')
export class AutoserviceProcessor extends WorkerHost {
  async process(job: Job<any, any, string>) {
    console.log('Processing job:', job.id, job.data);

    // Coloque sua lógica aqui
    return { success: true };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed.`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed.`, error.message);
  }
}
