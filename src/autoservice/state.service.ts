import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

export enum QueueState {
    FREE = 'free',
    BUSY = 'busy',
}

@Injectable()
export class StateService implements OnModuleInit {
    private bullState: QueueState = QueueState.FREE;
    private sqsState: QueueState = QueueState.FREE;
    private appIsFree = false;

    constructor(private readonly eventEmitter: EventEmitter2) { }

    onModuleInit() {
        // você pode chamar aqui se quiser iniciar a escuta logo no boot
        this.checkAndEmitAppFree();
    }

    private checkAndEmitAppFree() {
        if (this.bullState === QueueState.FREE && this.sqsState === QueueState.FREE && !this.appIsFree) {
            this.appIsFree = true; // evita emitir múltiplas vezes
            console.log('✅ App livre! Emitindo app.free...');
            this.eventEmitter.emit('app.free');
        }
    }

    async waitAppFree() {
        while (this.bullState === QueueState.BUSY && this.sqsState === QueueState.BUSY) {
            console.log('Fila ocupada. Aguardando liberação...');
            this.eventEmitter.emit('app.busy');
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
        this.eventEmitter.emit('app.free');
    }

    checkState() {
        if (this.bullState === QueueState.FREE && this.sqsState === QueueState.FREE) {
            this.eventEmitter.emit('app.free');
        }
        return this.bullState === QueueState.FREE && this.sqsState === QueueState.FREE;
    }

    public setBullState(state: QueueState) {
        this.bullState = state;

        if (state === QueueState.FREE) {
            this.eventEmitter.emit('bull.free');
        } else if (state === QueueState.BUSY) {
            this.eventEmitter.emit('bull.busy');
        }
    }

    public setSqsState(state: QueueState) {
        this.sqsState = state;

        if (state === QueueState.FREE) {
            this.eventEmitter.emit('sqs.free');
        } else if (state === QueueState.BUSY) {
            this.eventEmitter.emit('sqs.busy');
        }
    }

    getBullState() {
        return this.bullState;
    }

    getSqsState() {
        return this.sqsState;
    }

    getState() {
        return this.bullState === QueueState.FREE && this.sqsState === QueueState.FREE ? 'free' : 'busy';
    }

    @OnEvent('bull.state')
    async handleBullState(payload: any) {
        this.bullState = payload.state;
        this.checkState();
    }

    @OnEvent('sqs.state')
    async handleSqsState(payload: any) {
        this.sqsState = payload.state;
        this.checkState();
    }

    @OnEvent('waiting.complete')
    async handleWaitingComplete() {
        console.log('⏳ Esperando 20 segundos para confirmar se a aplicação está livre...');


        if (this.bullState === QueueState.FREE && this.sqsState === QueueState.FREE) {
            console.log('✅ Estado confirmado: bull e sqs continuam livres após 20s!');
            this.eventEmitter.emit('app.free');
        } else {
            console.log('⚠️ Estado alterado: bull ou sqs ficaram ocupados nesse tempo.');
        }
    }
}
