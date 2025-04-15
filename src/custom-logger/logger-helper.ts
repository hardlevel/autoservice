import { CustomLoggerService } from "./custom-logger.service";


export class LoggerHelper {
    private static service: CustomLoggerService;

    static setService(service: CustomLoggerService) {
        this.service = service;
    }

    static getService(): CustomLoggerService {
        if (!this.service) {
            throw new Error('LoggingService não foi inicializado no LoggerHelper!');
        }
        return this.service;
    }
}
