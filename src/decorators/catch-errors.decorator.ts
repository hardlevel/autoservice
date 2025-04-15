import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Prisma } from '../../prisma/clients/psql';
import { LoggerHelper } from '../custom-logger/logger-helper';

export function CatchErrors(): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // Aqui você pode personalizar como lidar com os erros:
        // - Logar
        // - Enviar para um serviço externo
        // - Retornar um fallback
        // console.error(`[Erro em ${String(propertyKey)}]:`, error);
        const contextInfo = {
          className: target.constructor.name,
          methodName: String(propertyKey),
          arguments: args,
          errorName: error.name,
          errorMessage: error.message,
          stack: error.stack,
        };

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            console.error('🔥 Duplicated unique constraint:', error.meta);
          }
        }
        const context = `${target.constructor.name}.${String(propertyKey)}`;

        const loggerService = LoggerHelper.getService();

        loggerService.error(`Erro em ${context}`, error);
        // await loggerService.logErrorToDb(error, context);

        console.error('❌ Erro capturado:', contextInfo);
        // Você pode relançar ou retornar algo padronizado
        // throw error;
      }
    };

    return descriptor;
  };
}
