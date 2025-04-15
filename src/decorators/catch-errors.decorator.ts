import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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
        console.error(`[Erro em ${String(propertyKey)}]:`, error);

        // Você pode relançar ou retornar algo padronizado
        throw error;
      }
    };

    return descriptor;
  };
}
