import {
  forwardRef,
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LazyModuleLoader } from "@nestjs/core";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { QueueService } from "./queues/queue.service";
import { Message } from "@aws-sdk/client-sqs";
import { AutoserviceService } from "./autoservice.service";
import { UtilService } from "../util/util.service";
import { DateService } from "../util/date.service";

@Injectable()
export class SqsConsumer implements OnModuleInit {
  private checkingSqs = false;

  constructor(
    private lazyModuleLoader: LazyModuleLoader,
    private readonly config: ConfigService,
    private readonly sqsService: SqsService,
    private readonly emitter: EventEmitter2,
    private readonly queue: QueueService,
    @Inject(forwardRef(() => AutoserviceService)) private readonly autoservice: AutoserviceService,
    private readonly util: UtilService,
    private readonly dates: DateService,
  ) {}

  async onModuleInit() {
    // const isEmpty = await this.isSqsActiveAndEmpty();
    // if (isEmpty) {
    //     this.emitter.emit('sqs.free');
    // }
  }

  @SqsMessageHandler("autoservice", false)
  private async handleMessage(message: Message) {
    // if (!this.autoservice.startDate || !this.autoservice.endDate) {
    //     const { year, month, day, hour } = await this.log.getLastParams(2025);
    //     this.autoservice.startDate = this.dates.setDate(year, month, day, hour - 1);
    //     this.autoservice.endDate = this.dates.setDate(year, month, day, hour);
    // }
    const msgBody = JSON.parse(message.Body);
    if (msgBody) {
      console.log("mensagem recebida", this.autoservice.startDate, this.autoservice.endDate);
      msgBody.startDate = this.autoservice.startDate;
      msgBody.endDate = this.autoservice.endDate;
    }
    // console.log(msgBody);
    try {
      // this.emitter.emit("sqs.message");
      const job = await this.queue.addJobToQueue("autoservice", msgBody);
    } catch (error) {
      console.error("consumer error", JSON.stringify(error));
      // this.log.setLog(
      //   "error",
      //   "Erro ao processar mensagem do SQS",
      //   error.message,
      //   this.autoservice.startDate,
      //   this.autoservice.endDate,
      // );
    }
  }

  // @OnEvent('waiting.messages')
  // public async waitForMessages() {
  //     await new Promise(resolve => setTimeout(resolve, 20000));

  //     const isEmpty = await this.isSqsActiveAndEmpty();
  //     console.log('✅ 20s passaram. Verificando o estado do SQS...');

  //     if (isEmpty) {
  //         console.log('✅ SQS está vazio após 20s. Liberando...');
  //         this.emitter.emit('sqs.state', { state: 'free' });
  //     } else {
  //         console.log('⛔ SQS recebeu mensagens. Não vamos liberar agora.');
  //         this.emitter.emit('sqs.state', { state: 'busy' });
  //     }
  // }

  public async getSqsStatus(): Promise<boolean> {
    try {
      const { isPolling, isRunning } =
        await this.sqsService.consumers.get("autoservice").instance.status;
      return isPolling && isRunning;
    } catch (error) {
      // this.log.setLog(
      //   "error",
      //   "Não foi possível verificar o status do SQS",
      //   error.message,
      //   this.autoservice.startDate,
      //   this.autoservice.endDate,
      // );
      return false;
    }
  }

  public async getSqsMessagesCount(): Promise<any> {
    try {
      const result = await this.sqsService.getQueueAttributes("autoservice");
      return result.ApproximateNumberOfMessages;
    } catch (error) {
      // this.log.setLog(
      //   "error",
      //   "Não foi possível verificar o status do SQS",
      //   error.message,
      //   this.autoservice.startDate,
      //   this.autoservice.endDate,
      // );
      return [];
    }
  }

  public async isSqsEmpty(): Promise<any> {
    try {
      const result = await this.sqsService.getQueueAttributes("autoservice");
      const count = parseInt(result.ApproximateNumberOfMessages);
      if (count === 0) {
        return true;
      }
      return false;
    } catch (error) {
      // this.log.setLog(
      //   "error",
      //   "Não foi possível verificar o status do SQS",
      //   error.message,
      //   this.autoservice.startDate,
      //   this.autoservice.endDate,
      // );
      return false;
    }
  }

  public async isSqsActiveAndEmpty(): Promise<boolean> {
    try {
      const isEmpty = await this.isSqsEmpty();
      const isActive = await this.getSqsStatus();

      console.log("Estado do SQS - Vazio:", isEmpty, "Ativo:", isActive);

      return isEmpty && isActive;
    } catch (error) {
      // this.log.setLog(
      //   "error",
      //   "Não foi possível verificar o status do SQS",
      //   error?.message || error.toString(),
      //   this.autoservice.startDate,
      //   this.autoservice.endDate,
      // );
      return false;
    }
  }

  private async purgeQueue() {
    await this.sqsService.purgeQueue("autoservice");
  }

  @SqsConsumerEventHandler("autoservice", "message_received")
  public onMsgReceived() {
    // console.log("📨 Mensagem recebida durante verificação.");
    this.emitter.emit("sqs.message");
  }

  @OnEvent("sqs.confirm")
  @SqsConsumerEventHandler("autoservice", "empty")
  public async onEmpty(data) {
    try {
      await this.emitter.waitFor("sqs.message", {
        timeout: 30000,
        handleError: true,
        overload: false,
        filter: () => true,
        Promise: Promise,
      });
    } catch (err) {
      if (err && err.message === "timeout") {
        this.emitter.emit("sqs.empty");
      } else {
        console.error("Erro ao esperar evento sqs.message:", err);
      }
    }
  }

  @SqsConsumerEventHandler("autoservice", "started")
  public async onStarted() {
    console.log("sqs iniciando, verificando status...");
    const isEmpty = await this.isSqsEmpty();
    if (isEmpty) this.emitter.emit("sqs.confirm");
    return;
  }

  @SqsConsumerEventHandler("autoservice", "processing_error")
  public onProcessingError(error: Error, message: Message) {
    // this.log.setLog(
    //   "error",
    //   "Há algum problema no SQS externo",
    //   error.message,
    //   this.autoservice.startDate,
    //   this.autoservice.endDate,
    // );
  }

  @OnEvent("sqs.start")
  public async onSqsStart() {
    const sqsStatus = await this.isSqsActiveAndEmpty();
    sqsStatus ? this.emitter.emit("sqs.busy") : this.emitter.emit("sqs.free");
    console.log(`📦 Sqs está ${sqsStatus ? "ativa (busy)" : "inativa (free)"}`);
  }

  //   @OnEvent("sqs.empty")
  //   public async onSqsEmpty() {
  //     if (this.checkingSqs) return;

  //     this.checkingSqs = true;
  //     console.log("Aguardando novas mensagens, margem de segurança");

  //     try {
  //       await this.emitter.waitFor("sqs.newMessage", {
  //         timeout: 20000,
  //         handleError: false,
  //         filter: () => true,
  //         Promise: Promise,
  //         overload: false,
  //       });
  //       console.log("Nova mensagem recebida, verificando estabilidade da fila");
  //       this.emitter.emit("sqs.busy");
  //     } catch (e) {
  //       console.log("Nenhuma nova mensagem recebida, fila está livre");
  //       this.emitter.emit("sqs.free");
  //     } finally {
  //       this.checkingSqs = false;
  //     }
  //   }

  @OnEvent("sqs.check")
  async handleSqsCheck() {
    const isFree = await this.isSqsActiveAndEmpty();
    if (isFree) {
      this.emitter.emit("sqs.free");
    }
  }
}
