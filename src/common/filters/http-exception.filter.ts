import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

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

    const isUnAuthorized = statusCode === HttpStatus.UNAUTHORIZED;
    const isBadRequest = statusCode === HttpStatus.BAD_REQUEST;

    let errorCode;

    if (error.errorCode) {
      errorCode = error.errorCode;
    } else {
      if (isUnAuthorized) {
        errorCode = 'UNAUTHORIZED_KEY';
      } else if (isBadRequest) {
        errorCode = 'INVALID_REQUEST';
      } else {
        errorCode = 'UNDEFINED_ERROR_CODE';
      }
    }

    const message = isUnAuthorized ? 'Unauthorized key' : error.message || 'UNDEFINED_ERROR_MESSAGE';

    return response.status(statusCode).json({
      statusCode,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
