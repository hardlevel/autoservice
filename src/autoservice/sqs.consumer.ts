import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LazyModuleLoader } from "@nestjs/core";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { QueueService } from "./queue.service";
import { Message } from "@aws-sdk/client-sqs";
import { AutoserviceService } from "./autoservice.service";
import { LogService } from "./log.service";

@Injectable()
export class SqsConsumer implements OnApplicationBootstrap {
    public sqsEmpty: boolean;

    constructor(
        private lazyModuleLoader: LazyModuleLoader,
        private readonly config: ConfigService,
        private readonly sqsService: SqsService,
        private readonly emitter: EventEmitter2,
        private readonly queue: QueueService,
        @Inject(forwardRef(() => AutoserviceService)) private readonly autoservice: AutoserviceService,
        private readonly log: LogService
    ) { }
    onApplicationBootstrap() {
        throw new Error("Method not implemented.");
    }

    // public async onApplicationBootstrap() {
    //     this.observeSqs();
    // }

    @SqsMessageHandler('autoservice', false)
    private async handleMessage(message: Message) {
        const msgBody = JSON.parse(message.Body);
        if (msgBody) {
            console.log('mensagem recebida', this.autoservice.startDate, this.autoservice.endDate);
            msgBody.startDate = this.autoservice.startDate;
            msgBody.endDate = this.autoservice.endDate;
        };
        try {
            const job = await this.queue.addJobsToQueue('autoservice', msgBody);
        } catch (error) {
            console.error('consumer error', JSON.stringify(error));
            this.log.setLog('error', 'Erro ao processar mensagem do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
        }
    }

    public async getSqsStatus(): Promise<boolean> {
        try {
            const { isPolling, isRunning } = await this.sqsService.consumers.get('autoservice').instance.status;
            return isPolling && isRunning;
        } catch (error) {
            this.log.setLog('error', 'Não foi possível verificar o status do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
            return false;
        }
    }

    public async getSqsMessagesCount(): Promise<any> {
        try {
            const result = await this.sqsService.getQueueAttributes('autoservice');
            this.emitter.emit('sqsEmpty');
            return result.ApproximateNumberOfMessages;
        } catch (error) {
            this.log.setLog('error', 'Não foi possível verificar o status do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
            return [];
        }
    }

    public async isSqsEmpty(): Promise<any> {
        try {
            const result = await this.sqsService.getQueueAttributes('autoservice');
            const count = result.ApproximateNumberOfMessages;
            console.log('tipo de count é', typeof count);
            return result.ApproximateNumberOfMessages;
        } catch (error) {
            this.log.setLog('error', 'Não foi possível verificar o status do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
            return [];
        }
    }

    // public observeSqs() {
    //     this.emitter.waitFor('event').then(function (data) {
    //         console.log('Evento recebido:', data);
    //     });
    // }

    private async purgeQueue() {
        await this.sqsService.purgeQueue('autoservice');
    }

    @SqsConsumerEventHandler('autoservice', 'empty')
    public onEmpty() {
        this.sqsEmpty = true;
        this.emitter.emit('event', 'sqsEmpty');
    }

    @SqsConsumerEventHandler('autoservice', 'aborted')
    public onAbort() {
        this.sqsEmpty = true;
        this.emitter.emit('event', 'sqsEmpty');
    }

    @SqsConsumerEventHandler('autoservice', 'stopped')
    public onStop() {
        this.sqsEmpty = true;
        this.emitter.emit('event', 'sqsEmpty');
    }

    @SqsConsumerEventHandler('autoservice', 'timeout_error')
    public onTimeout(error: Error, message: Message) {
        this.sqsEmpty = true;
        this.emitter.emit('event', 'sqsEmpty');
    }

    @SqsConsumerEventHandler('autoservice', 'message_received')
    public onMsgReceived() {
        this.sqsEmpty = false;
    }

    @SqsConsumerEventHandler('autoservice', 'waiting_for_polling_to_complete')
    public onWaiting() {
        this.sqsEmpty = false;
        console.log('aguardando conclusão');
    }

    @SqsConsumerEventHandler('queueName', 'processing_error')
    public onProcessingError(error: Error, message: Message) {
        this.log.setLog('error', 'Há algum problema no SQS externo', error.message, this.autoservice.startDate, this.autoservice.endDate)
    }
}