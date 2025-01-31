import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class GlobalErrorHandler implements OnModuleInit {
    onModuleInit() {
        process.on('uncaughtException', (error) => {
            console.error('Erro não tratado:', error.message);
        });

        process.on('unhandledRejection', (reason) => {
            console.error('Rejeição não tratada:', reason);
        });
    }
}