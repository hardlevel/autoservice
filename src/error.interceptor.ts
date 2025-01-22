import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadGatewayException,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // console.log('erro interceptado', context, next);
        return next
            .handle()
            .pipe(
                catchError((err) => {
                    console.log(err);
                    return throwError(() => {err})
                }),
            );
    }
}
// import {
//     CallHandler,
//     ExecutionContext,
//     Injectable,
//     NestInterceptor,
// } from '@nestjs/common';
// import { catchError, Observable, throwError } from 'rxjs';

// @Injectable()
// export class ExceptionInterceptor implements NestInterceptor {
//     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//         return next.handle().pipe(
//             catchError((error) => {
//                 console.error('Erro interceptado no ExceptionInterceptor:', {
//                     mensagem: error?.message || 'Erro desconhecido',
//                     stack: error?.stack,
//                 });

//                 // Propaga o erro para o próximo manipulador (o filtro global, neste caso)
//                 return throwError(() => error);
//             })
//         );
//     }
// }
