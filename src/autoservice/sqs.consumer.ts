import { forwardRef, Inject, Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LazyModuleLoader } from "@nestjs/core";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { QueueService } from "./queue.service";
import { Message } from "@aws-sdk/client-sqs";
import { AutoserviceService } from "./autoservice.service";
import { LogService } from "./log.service";
import { UtilService } from "../util/util.service";
import { DateService } from "../util/date.service";
import { StateService, QueueState } from "./state.service";

@Injectable()
export class SqsConsumer implements OnModuleInit {
    public sqsEmpty: boolean;
    public sqsInterrupted: boolean = false;
    private isVerifyingEmpty = false;
    private lastVerifiedEmpty: boolean = false;

    constructor(
        private lazyModuleLoader: LazyModuleLoader,
        private readonly config: ConfigService,
        private readonly sqsService: SqsService,
        private readonly emitter: EventEmitter2,
        private readonly queue: QueueService,
        @Inject(forwardRef(() => AutoserviceService)) private readonly autoservice: AutoserviceService,
        private readonly log: LogService,
        private readonly util: UtilService,
        private readonly dates: DateService,
        private readonly state: StateService,
    ) { }

    async onModuleInit() {
        // const isEmpty = await this.isSqsActiveAndEmpty();
        // if (isEmpty) {
        //     this.emitter.emit('sqs.free');
        // }
    }

    @SqsMessageHandler('autoservice', false)
    private async handleMessage(message: Message) {
        // if (!this.autoservice.startDate || !this.autoservice.endDate) {
        //     const { year, month, day, hour } = await this.log.getLastParams(2025);
        //     this.autoservice.startDate = this.dates.setDate(year, month, day, hour - 1);
        //     this.autoservice.endDate = this.dates.setDate(year, month, day, hour);
        // }
        const msgBody = JSON.parse(message.Body);
        if (msgBody) {
            console.log('mensagem recebida', this.autoservice.startDate, this.autoservice.endDate);
            msgBody.startDate = this.autoservice.startDate;
            msgBody.endDate = this.autoservice.endDate;
        };

        try {
            const job = await this.queue.addJobToQueue('autoservice', msgBody);
        } catch (error) {
            console.error('consumer error', JSON.stringify(error));
            this.log.setLog('error', 'Erro ao processar mensagem do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
        }
    }

    @OnEvent('waiting.messages')
    public async waitForMessages() {
        await new Promise(resolve => setTimeout(resolve, 20000));

        const isEmpty = await this.isSqsActiveAndEmpty();
        console.log('✅ 20s passaram. Verificando o estado do SQS...');

        if (isEmpty) {
            console.log('✅ SQS está vazio após 20s. Liberando...');
            this.emitter.emit('sqs.state', { state: 'free' });
        } else {
            console.log('⛔ SQS recebeu mensagens. Não vamos liberar agora.');
            this.emitter.emit('sqs.state', { state: 'busy' });
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

    public async waitSqsEmpty() {
        const empty = await this.isSqsEmpty();

        if (empty) return true;

        try {
            await Promise.race([
                this.emitter.waitFor('sqsEmpty'),
                this.util.timer(60),
            ]);
            return true;
        } catch {
            return false;
        }
    }

    public async waitSqsEmptyLoop(maxAttempts = 60, delaySeconds = 10): Promise<boolean> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const empty = await this.isSqsEmpty();

                if (empty === true) {
                    console.log('✅ SQS está vazio, continuando...');
                    return true;
                }

                console.log(`⌛ SQS ainda com mensagens. Tentativa ${attempt}/${maxAttempts}. Aguardando ${delaySeconds}s...`);
                await this.util.timer(delaySeconds); // Aguarda X segundos
            } catch (error) {
                this.log.setLog('error', 'Erro ao verificar status do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
                return false; // Falha crítica, pode parar o processamento
            }
        }

        console.warn('⚠️ Timeout: SQS não ficou vazio após várias tentativas.');
        return false;
    }

    public async isSqsActiveAndEmpty(): Promise<boolean> {
        try {
            const isEmpty = await this.isSqsEmpty();
            const isActive = await this.getSqsStatus();

            console.log('Estado do SQS - Vazio:', isEmpty, 'Ativo:', isActive);

            return isEmpty && isActive;
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

    // async verifySqsEmpty() {
    //     const isEmpty = await this.isSqsActiveAndEmpty();
    //     this.sqsEmpty = isEmpty;

    //     if (isEmpty) {
    //         this.state.setSqsState(QueueState.FREE);
    //         console.log('SQS está vazia');
    //     } else {
    //         this.state.setSqsState(QueueState.BUSY);
    //         console.log('SQS está ocupada');
    //     }
    // }

    private async purgeQueue() {
        await this.sqsService.purgeQueue('autoservice');
    }

    @SqsConsumerEventHandler('autoservice', 'message_received')
    public onMsgReceived() {
        console.log('📨 Mensagem recebida durante verificação.');
        this.emitter.emit('sqsMessage');
        this.emitter.emit('sqs.state', { state: 'busy' });
    }

    @SqsConsumerEventHandler('autoservice', 'empty')
    public onEmpty(data) {
        console.log('🔄 Verificação de estabilidade da fila cancelada.');
        this.emitter.emit('sqsEmpty');
        this.emitter.emit('sqs.state', { state: 'free' });
        this.emitter.emit('bull.state', { state: 'free' });
        console.log(this.state.getBullState(), this.state.getSqsState());
    }

    @SqsConsumerEventHandler('autoservice', 'processing_error')
    public onProcessingError(error: Error, message: Message) {
        this.log.setLog('error', 'Há algum problema no SQS externo', error.message, this.autoservice.startDate, this.autoservice.endDate)
    }


    @OnEvent('sqs.start')
    public async onSqsStart() {
        const sqsStatus = await this.isSqsActiveAndEmpty();
        const state = sqsStatus ? 'free' : 'busy';
        await this.emitter.emit('sqs.state', { state });
    }
}