import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        message = (res as { message?: string | string[] })?.message?.toString() || 'Something went wrong';
      }
    }

    // Determine if we should log the exception
    const isAuthError =
      statusCode === HttpStatus.UNAUTHORIZED ||
      (statusCode === HttpStatus.BAD_REQUEST && message.toLowerCase().includes('token'));

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('--- GlobalExceptionFilter (Error) ---');
      console.error(`Request: ${request.method} ${request.url}`);
      console.error('Exception:', exception);
    } else if (!isAuthError) {
      // For other 4xx errors, we log them as warnings without full stack trace to keep logs clean
      console.warn('--- GlobalExceptionFilter (Warning) ---');
      console.warn(`Request: ${request.method} ${request.url}`);
      console.warn(`Status: ${statusCode} - Message: ${message}`);
    }

    response.status(statusCode).json({
      status: 'failed',
      data: null,
      message,
    });
  }
}
