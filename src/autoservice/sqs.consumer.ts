import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LazyModuleLoader } from "@nestjs/core";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { QueueService } from "./queue.service";
import { Message } from "@aws-sdk/client-sqs";
import { AutoserviceService } from "./autoservice.service";
import { LogService } from "./log.service";

@Injectable()
export class SqsConsumer {
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
            return result.ApproximateNumberOfMessages;
        } catch (error) {
            this.log.setLog('error', 'Não foi possível verificar o status do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
            return [];
        }
    }

    public async isSqsEmpty(): Promise<any> {
        try {
            const result = await this.sqsService.getQueueAttributes('autoservice');
            const count = parseInt(result.ApproximateNumberOfMessages);
            if (count === 0) {
                return true;
            }
            return false;
        } catch (error) {
            this.log.setLog('error', 'Não foi possível verificar o status do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
            return [];
        }
    }

    public async isSqsActiveAndEmpty(): Promise<boolean> {
        try {
            const isEmpty = await this.isSqsEmpty();
            const isActive = await this.getSqsStatus();

            console.log('Estado do SQS - Vazio:', isEmpty, 'Ativo:', isActive);

            if (isEmpty && isActive) {
                console.log('Está vazio, emitindo evento!');
                this.emitter.emit('sqsEmpty');
                return true;
            }

            return false;
        } catch (error) {
            this.log.setLog(
                'error',
                'Não foi possível verificar o status do SQS',
                error?.message || error.toString(),
                this.autoservice.startDate,
                this.autoservice.endDate
            );
            return false;
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
        this.emitter.emit('sqsEmpty', this.sqsEmpty);
    }

    @SqsConsumerEventHandler('autoservice', 'aborted')
    public onAbort() {
        this.sqsEmpty = true;
        this.emitter.emit('sqsEmpty', this.sqsEmpty);
    }

    @SqsConsumerEventHandler('autoservice', 'stopped')
    public onStop() {
        this.sqsEmpty = true;
        this.emitter.emit('sqsEmpty', this.sqsEmpty);
    }

    @SqsConsumerEventHandler('autoservice', 'timeout_error')
    public onTimeout(error: Error, message: Message) {
        this.sqsEmpty = true;
        this.emitter.emit('sqsEmpty', this.sqsEmpty);
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

    @SqsConsumerEventHandler('autoservice', 'processing_error')
    public onProcessingError(error: Error, message: Message) {
        this.log.setLog('error', 'Há algum problema no SQS externo', error.message, this.autoservice.startDate, this.autoservice.endDate)
    }

    // @OnEvent('sqsEmpty')
    // public onEmptyEvent(data) {
    //     console.log('evento recebido', data);
    //     return;
    // }
}