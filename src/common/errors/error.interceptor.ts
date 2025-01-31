import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadGatewayException,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError, catchError } from 'rxjs';
import { CustomError } from './custom-error';
// import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(
                catchError((err) => {
                    if (err instanceof CustomError) {
                        console.error('Erro customizado capturado:', err);
                        return throwError(() => new BadGatewayException({
                            message: err.message,
                            code: err.code,
                            cause: err.cause,
                            category: err.category,
                            startDate: err.startDate,
                            endDate: err.endDate
                        }));
                    } else {
                        console.error('Erro não tratado:', err);
                        return throwError(() => err);
                    }
                }),
            );
    }
}
