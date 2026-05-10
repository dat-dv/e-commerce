import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log('--- GlobalExceptionFilter ---');
    console.log('Request:', request.method, request.url);
    console.log('Exception:', exception);

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Nếu các lỗi được trả ra từ các Class
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        message = (res as { message?: string })?.message || 'Something went wrong';
      }
    }

    response.status(statusCode).json({
      status: 'failed',
      data: null,
      message,
    });
  }
}
