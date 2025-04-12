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
    @InjectQueue("autoservice") private readonly autoservice: Queue,
    @InjectQueue("hourly") private readonly hourly: Queue,
    private readonly config: ConfigService,
    private readonly util: UtilService,
    private readonly emitter: EventEmitter2,
    private readonly dates: DateService,
    private readonly scheduler: SchedulerRegistry,
    // @Inject(forwardRef(() => AutoserviceService)) private readonly autoserviceService: AutoserviceService,
  ) {}

  public async onApplicationBootstrap() {
    await this.autoservice.drain();
    await this.hourly.drain();
    console.log("filas drenadas");
    console.log(await this.getQueueStatus("autoservice"));
  }

  @Interval(100000)
  async retryFailedJobsAutoservice() {
    const { failed, paused } = await this.getQueueStatus("autoservice");
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

  @Interval(1000)
  async retryFailedJobsHourly() {
    const { failed, paused } = await this.getQueueStatus("hourly");
    if (await this.hourly.isPaused()) await this.hourly.resume();
    if (failed > 0) {
      const jobs = await this.hourly.getFailed();
      for (let failedjob of jobs) {
        const job = await this.hourly.getJob(failedjob.id);
        await job.retry();
      }
    }
    if (paused > 0) {
      const status = await this.hourly.isPaused();
      if (status) {
        await this.hourly.resume();
      }
    }
  }

  public async waitForQueueEmpty(queue) {
    if (!this[queue] || typeof this[queue].getJobCounts !== "function") {
      throw new Error(`Queue "${queue}" not found or is invalid`);
    }
    let notified = false;
    while (await this.isQueueActive(queue)) {
      if (!notified) {
        this.emitter.emit("state.change", { state: false });
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
      };

      if (!this[queue] || typeof this[queue].add !== "function") {
        throw new Error(`Fila ${queue} não encontrada`);
      }

      const job = await this[queue].add(queue, data, options);
      return job;
    } catch (error) {
      console.error(error);
    }
  }

  public async bulkAddJobs(queue: string, data: any[]): Promise<any> {
    // Verificar se a fila existe
    if (!this[queue]) {
      throw new Error(`Queue ${queue} not found. Ensure that the queue is properly initialized.`);
    }

    // Verificar se a fila é uma instância válida (por exemplo, do tipo Queue)
    if (!(this[queue] instanceof Queue)) {
      throw new Error(`Queue ${queue} is not a valid Queue instance.`);
    }

    // Verificar se a fila tem o método addBulk
    if (typeof this[queue].addBulk !== "function") {
      throw new Error(`Method addBulk not found on the queue ${queue}.`);
    }

    // Adicionar os jobs em bulk
    try {
      console.log(`Adicionando ${data.length} jobs na fila ${queue}`);
      return await this[queue]
        .addBulk(data)
        .then((jobs) => this.emitter.emit("hourly.jobs.added", jobs.length));
    } catch (error) {
      console.error(
        `Error adding bulk jobs to queue ${queue}. Data: ${JSON.stringify(data)}`,
        error,
      );
      throw error; // Propaga o erro para o chamador
    }
  }

  public async getQueueStatus(queue: string): Promise<Record<string, number>> {
    try {
      if (!this[queue] || typeof this[queue].getJobCounts !== "function") {
        throw new Error(`Queue "${queue}" not found or is invalid`);
      }
      const activeJobs = await this[queue].getJobCounts();
      return activeJobs;
    } catch (error) {
      Logger.error(`Failed to get queue status for ${queue}: ${error.message}`);
      throw error;
    }
  }

  public async isQueueActive(queue) {
    const { active, waiting, delayed } = await this.getQueueStatus(queue);
    return active > 0 || waiting > 0 || delayed > 0;
  }

  public async pauseQueue(queue) {
    try {
      if (!this[queue] || typeof this[queue].getJobCounts !== "function") {
        throw new Error(`Queue "${queue}" not found or is invalid`);
      }
      if (this[queue].isPaused()) return;
      this[queue].pause();
      return;
    } catch (error) {
      throw new Error(`Falha ao pausar fila ${queue}`);
    }
  }

  public async resumeQueue(queue) {
    try {
      if (!this[queue] || typeof this[queue].getJobCounts !== "function") {
        throw new Error(`Queue "${queue}" not found or is invalid`);
      }
      if (this[queue].isPaused()) this[queue].resume();
      return;
    } catch (error) {
      throw new Error(`Falha ao retomar fila ${queue}`);
    }
  }

  //EVENTS
  @OnEvent("queue.start")
  async onAppStart() {
    console.log("recebeu evento queue.start");
    // const status = await this.isQueueActive('autoservice');
    // console.log(status)
    // // const state = status ? 'busy' : 'free';
    // // this.emitter.emit('bull.state', { type: 'queue', name: 'autoservice', state });
    // status ? this.emitter.emit('bull.busy') : this.emitter.emit('bull.free');
    // console.log(`📦 Fila autoservice está ${status ? 'ativa (busy)' : 'inativa (free)'}`);
  }

  //INTERVALS
  @Interval(10000)
  async checkAutoserviceQueue() {
    const autoServiceStatus = await this.isQueueActive("autoservice");
    const hourlyStatus = await this.isQueueActive("hourly");
    const statusB = await this.getQueueStatus("hourly");
    const statusA = await this.getQueueStatus("autoservice");
    console.log(statusA, statusB);
    if (autoServiceStatus === false) {
      await this.emitter.emit("autoservice.queue.confirm");
    }
    if (hourlyStatus === false) {
      await this.emitter.emit("hourly.queue.confirm");
    }
  }

  //CHECKS
  @OnEvent("queue.check")
  async handleQueueCheck(queue: string) {
    console.log("evento recebido", queue);
    const isActive = await this.isQueueActive(queue);
    if (!isActive) {
      this.emitter.emit(`${queue}.empty`);
    }
    return isActive;
  }

  @OnEvent("autoservice.queue.confirm")
  async handleAutoserviceConfirm() {
    let messageReceived = false; // Flag para verificar se a mensagem foi recebida
    const timeout = 20000; // Tempo limite de 20 segundos
    const startTime = Date.now(); // Início da espera

    console.log("Aguardando mensagem na fila SQS...");

    // Contagem regressiva no console
    const countdownInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const timeLeft = Math.max(0, timeout - elapsedTime);
      const secondsLeft = Math.ceil(timeLeft / 1000); // Converte o tempo restante em segundos
      // console.log(`Tempo restante: ${secondsLeft} segundos`);
    }, 1000); // Atualiza a cada 1 segundo

    // Criando uma promessa para o evento `sqs.message`
    const sqsMessagePromise = new Promise<void>((resolve, reject) => {
      this.emitter
        .waitFor("sqs.message", {
          timeout,
          overload: false,
          Promise: Promise,
          handleError: true,
          filter: () => true, // Aqui você pode adicionar lógica adicional para filtrar os eventos
        })
        .then(() => {
          console.log("Mensagem recebida na fila SQS.");
          messageReceived = true;
          clearInterval(countdownInterval); // Limpa a contagem regressiva
          resolve(); // Mensagem recebida, resolve a promise
        })
        .catch((error) => {
          // console.log("Erro ao aguardar a mensagem no SQS:", error);
          clearInterval(countdownInterval); // Limpa a contagem regressiva
          reject(error); // Caso o timeout ou outro erro aconteça
        });
    });

    // Criando a promessa do timeout de 20 segundos
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => {
        if (!messageReceived) {
          console.log("Tempo de espera esgotado, sem nova mensagem.");
          clearInterval(countdownInterval); // Limpa a contagem regressiva
          reject(new Error("Tempo de espera de 20 segundos esgotado"));
        }
      }, timeout),
    );

    try {
      // Esperando a primeira promessa que for resolvida (mensagem ou timeout)
      await Promise.race([sqsMessagePromise, timeoutPromise]);

      if (messageReceived) {
        console.log("Fila autoservice ainda operante, não emitindo 'autoservice.finished'.");
      } else {
        // Se não recebemos uma mensagem e o tempo passou, emitimos o evento de finalização
        console.log("Finalizando processamento da fila...");
        this.emitter.emit("autoservice.finished");
      }
    } catch (error) {
      // console.log("Erro ou timeout:", error.message);
      if (!messageReceived) {
        // Caso o evento `sqs.message` não tenha sido recebido e o tempo tenha expirado
        console.log("Finalizando processamento da fila...");
        this.emitter.emit("autoservice.finished");
      }
    }
  }

  @OnEvent("autoservice.running")
  async handleAutoServiceRunning() {
    console.log("evento autoservice.running recebido! pausando fila hourly");
    await this.pauseQueue("hourly");
  }

  @OnEvent("autoservice.finished")
  async handleAutoServiceFinished() {
    console.log("evento autoservice.finished recebido! retomando fila hourly");
    await this.resumeQueue("hourly");
    this.emitter.emit("autoservice.empty");
    // this.emitter.emit("hourly.continue");
  }

  @OnEvent("hourly.queue.confirm")
  async handleHourlyConfirm() {
    console.log("aguardando a fila hourly esvaziar...");

    while (await this.isQueueActive("hourly")) {
      console.log("fila hourly ainda ativa... aguardando 10s");
      const autoserviceStatus = await this.isQueueActive("autoservice");
      const hourlyStatus = await this.hourly.isPaused();
      if (!autoserviceStatus) {
        if (hourlyStatus) {
          await this.resumeQueue("hourly");
        } else {
          this.emitter.emit("autoservice.empty");
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    console.log("fila hourly está vazia! encerrando fila");
    this.emitter.emit("hourly.empty");
  }

  @OnEvent("teste")
  async handleTeste() {
    setTimeout(() => console.log("aguardando"), 10000);
    return `blabla`;
  }

  @OnEvent("hourly.jobs.added")
  async handleHourlyJobs(qtd: number) {
    console.log(`${qtd} jobs adicionados!`);
  }
}
