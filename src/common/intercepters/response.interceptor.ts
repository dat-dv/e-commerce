import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * Hạn chế vì nó ảnh hưởng đến việc generate documents cho swagger
 * app.useGlobalInterceptors(new ResponseInterceptor());
 **/
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        return {
          status: 'success',
          data,
          message: null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
