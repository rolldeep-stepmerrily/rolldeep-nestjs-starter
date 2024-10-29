import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

interface IErrorResponse {
  message: string;
  errorCode?: string;
  [key: string]: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error: IErrorResponse =
      typeof exceptionResponse === 'string' ? { message: exceptionResponse } : (exceptionResponse as IErrorResponse);

    return response.status(statusCode).json({
      statusCode,
      errorCode: error.errorCode || 'UNDEFINED_ERROR_CODE',
      message: error.message || 'UNDEFINED_ERROR_MESSAGE',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
