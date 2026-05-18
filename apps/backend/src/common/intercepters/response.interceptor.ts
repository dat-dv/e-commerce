import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { IApiResponse } from '@ecommerce/shared';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
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
