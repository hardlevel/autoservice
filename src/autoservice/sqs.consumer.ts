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
    ) { }

    // public async onApplicationBootstrap() {
    //     this.observeSqs();
    // }
    async onModuleInit() {
        console.log('sqs consumer init');
        // const status = await this.isSqsActiveAndEmpty();
        // if (status) this.emitter.emit('sqsEmpty');
        // await this.purgeQueue();
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

    // public async waitSqsEmpty() {
    //     try {
    //         if (!await this.isSqsEmpty()) {
    //             await this.emitter.waitFor('sqsEmpty');
    //         }
    //         return;
    //     } catch (error) {
    //         this.log.setLog('error', 'Não foi possível verificar o status do SQS', error.message, this.autoservice.startDate, this.autoservice.endDate);
    //         return;
    //     }
    // }

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

    // @SqsConsumerEventHandler('autoservice', 'empty')
    // public async waitUntilSqsReallyEmpty(): Promise<void> {
    //     if (this.isVerifyingEmpty) {
    //         console.log('⏳ Já existe uma verificação de SQS em andamento. Ignorando este evento.');
    //         return;
    //     }

    //     this.isVerifyingEmpty = true;

    //     const intervalSeconds = 10;
    //     const maxAttempts = 10;
    //     let stableCount = 0;
    //     this.sqsInterrupted = false; // resetar a flag de interrupção

    //     console.log('📥 Evento SQS empty recebido. Verificando se fila estável...');

    //     for (let i = 1; i <= maxAttempts; i++) {
    //         if (this.sqsInterrupted) {
    //             console.log('❌ Verificação cancelada: nova mensagem recebida durante o processo.');
    //             this.isVerifyingEmpty = false;
    //             return;
    //         }

    //         const isEmpty = await this.isSqsEmpty();

    //         if (isEmpty) {
    //             stableCount++;
    //             console.log(`🔍 Verificação ${i}/${maxAttempts}: fila ainda vazia (${stableCount})`);
    //         } else {
    //             stableCount = 0;
    //             console.log(`📦 Fila recebeu mensagens na verificação ${i}. Reiniciando contagem...`);
    //         }

    //         if (stableCount >= maxAttempts) {
    //             console.log('✅ Fila confirmada como vazia após 10 verificações. Emitindo evento sqsEmpty...');
    //             this.emitter.emit('sqsEmpty');
    //             this.isVerifyingEmpty = false;
    //             return;
    //         }

    //         await this.util.progressBarTimer(intervalSeconds, `Verificação ${i}...`);
    //     }

    //     console.log('⚠️ Fila não se manteve vazia por 10 verificações.');
    //     this.isVerifyingEmpty = false;
    // }

    public async waitUntilSqsReallyEmptySafe(intervalSeconds = 10, maxAttempts = 10): Promise<boolean> {
        if (this.isVerifyingEmpty) {
            console.log('⏳ Já existe uma verificação em andamento. Aguardando ela terminar...');
            while (this.isVerifyingEmpty) {
                await this.util.delay(1000); // 1s entre checagens
            }
            return false;
        }

        this.isVerifyingEmpty = true;
        this.sqsInterrupted = false;

        console.log('📥 Iniciando verificação da estabilidade da fila...');

        let stableCount = 0;

        for (let i = 1; i <= maxAttempts; i++) {
            if (this.sqsInterrupted) {
                console.log('❌ Verificação cancelada: mensagem recebida.');
                this.isVerifyingEmpty = false;
                return false;
            }

            const isEmpty = await this.isSqsEmpty();

            if (isEmpty) {
                stableCount++;
                console.log(`🔍 Verificação ${i}/${maxAttempts}: fila ainda vazia (${stableCount})`);
            } else {
                stableCount = 0;
                console.log(`📦 Verificação ${i}: Fila não está vazia. Resetando contador.`);
            }

            if (stableCount >= maxAttempts) {
                console.log('✅ Fila SQS confirmada como vazia e estável.');

                // ⚠️ NOVO BLOCO: Verifica BullMQ antes de liberar
                const bullStatus = await this.queue.getBullMqStatus(); // Supondo QueueService injetado como `this.queue`
                if (bullStatus.waiting > 0 || bullStatus.active > 0 || bullStatus.delayed > 0) {
                    console.log(`🚧 BullMQ ainda ocupado (waiting: ${bullStatus.waiting}, active: ${bullStatus.active}, delayed: ${bullStatus.delayed}). Aguardando...`);

                    // Aguarda esvaziar BullMQ antes de prosseguir
                    while (bullStatus.waiting > 0 || bullStatus.active > 0 || bullStatus.delayed > 0) {
                        await this.util.progressBarTimer(intervalSeconds, '⏳ Aguardando BullMQ esvaziar...');
                        const again = await this.queue.getBullMqStatus();
                        bullStatus.waiting = again.waiting;
                        bullStatus.active = again.active;
                        bullStatus.delayed = again.delayed;
                    }

                    console.log('✅ BullMQ também esvaziou.');
                }

                this.emitter.emit('sqsEmpty');
                this.isVerifyingEmpty = false;
                return true;
            }

            await this.util.progressBarTimer(intervalSeconds, `Verificação ${i}...`);
        }

        console.log('⚠️ Fila não se manteve estável. Abortando verificação.');
        this.isVerifyingEmpty = false;
        return false;
    }

    @SqsConsumerEventHandler('autoservice', 'message_received')
    public onMsgReceived() {
        console.log('📨 Mensagem recebida durante verificação.');
        this.emitter.emit('sqsMessage');
    }

    @SqsConsumerEventHandler('autoservice', 'empty')
    public onEmpty(data) {
        console.log('🔄 Verificação de estabilidade da fila cancelada.');
        this.emitter.emit('sqsEmpty');
    }

    // @SqsConsumerEventHandler('autoservice', 'aborted')
    // public onAbort() {
    //     this.sqsEmpty = true;
    //     this.emitter.emit('sqsEmpty', this.sqsEmpty);
    // }

    // @SqsConsumerEventHandler('autoservice', 'stopped')
    // public onStop() {
    //     this.sqsEmpty = true;
    //     this.emitter.emit('sqsEmpty', this.sqsEmpty);
    // }

    // @SqsConsumerEventHandler('autoservice', 'timeout_error')
    // public onTimeout(error: Error, message: Message) {
    //     this.sqsEmpty = true;
    //     this.emitter.emit('sqsEmpty', this.sqsEmpty);
    // }

    // @SqsConsumerEventHandler('autoservice', 'message_received')
    // public onMsgReceived() {
    //     this.sqsEmpty = false;
    // }

    // @SqsConsumerEventHandler('autoservice', 'waiting_for_polling_to_complete')
    // public onWaiting() {
    //     this.sqsEmpty = false;
    //     console.log('aguardando conclusão');
    // }

    @SqsConsumerEventHandler('autoservice', 'processing_error')
    public onProcessingError(error: Error, message: Message) {
        this.log.setLog('error', 'Há algum problema no SQS externo', error.message, this.autoservice.startDate, this.autoservice.endDate)
    }

    // @OnEvent('sqsEmpty')
    // public onEmptyEvent(data) {
    //     console.log('evento recebido', data);
    //     return;
    // }
    // @OnEvent('job.completed')
    // public async onJobCompleted(data) {
    //     await this.util.progressBarTimer(10, `aguardando após concluir o job ${data.id}`);
    //     const sqsStatus = await this.isSqsActiveAndEmpty();
    //     console.log('evento jobCompleted recebido!', sqsStatus);
    //     if (sqsStatus) {
    //         console.log('Emitindo sqsEmpty', sqsStatus);
    //         this.emitter.emit('sqsEmpty', true);
    //     }
    //     console.log('SQS ainda recebendo mensagens...', sqsStatus);
    //     return;
    // }
}