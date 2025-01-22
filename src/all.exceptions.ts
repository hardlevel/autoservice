// import {
//     ExceptionFilter,
//     Catch,
//     ArgumentsHost,
//     HttpException,
//     HttpStatus,
//     BadRequestException,
//     NotFoundException,
//     UnauthorizedException,
//     ForbiddenException,
//     InternalServerErrorException,
// } from '@nestjs/common';
// import { PrismaExceptionFilter } from './prisma.exceptions';
// import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

// @Catch(Error)
// export class AllExceptionsFilter implements ExceptionFilter {
//     constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

//     catch(exception: unknown, host: ArgumentsHost): void {
//         console.log('teste filtro:', exception);
//         const { httpAdapter } = this.httpAdapterHost;
//         const ctx = host.switchToHttp();
//         const httpStatus =
//             exception instanceof HttpException
//                 ? exception.getStatus()
//                 : HttpStatus.INTERNAL_SERVER_ERROR;

//         console.log('Exceção capturada:', exception);
//         if (exception instanceof HttpException) {
//             console.log('Tipo de Exceção:', exception.constructor.name);
//             console.log('Código de Status:', exception.getStatus());
//             console.log('Mensagem de Erro:', exception.message);
//         }

//         let errorMessage = 'Ocorreu um erro inesperado';

//         if (exception instanceof HttpException) {
//             errorMessage = exception.message;
//         } else if (exception instanceof TypeError) {
//             errorMessage = 'Erro de tipo detectado';
//         } else if (exception instanceof ReferenceError) {
//             errorMessage = 'Erro de referência inválida';
//         } else {
//             errorMessage = exception instanceof Error ? exception.message : 'Erro desconhecido';
//         }

//         const responseBody = {
//             statusCode: httpStatus,
//             message: errorMessage,
//             timestamp: new Date().toISOString(),
//             path: httpAdapter.getRequestUrl(ctx.getRequest()),
//         };

//         console.log('Resposta enviada:', responseBody);

//         httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//     }
// }


import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(exception, host);
    console.log('caturado!', exception)

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const request = ctx.getRequest();

    response.status(status).json({
        timestamp: new Date().toISOString(),
        statusCode: status,
        path: request.url
    });
  }
}