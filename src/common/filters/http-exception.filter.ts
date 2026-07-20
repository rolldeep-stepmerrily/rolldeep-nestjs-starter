import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface IErrorResponse {
  message: string;
  errorCode?: string;
  [key: string]: unknown;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error: IErrorResponse =
      typeof exceptionResponse === 'string' ? { message: exceptionResponse } : (exceptionResponse as IErrorResponse);

    const isUnAuthorized = statusCode === HttpStatus.UNAUTHORIZED;
    const isBadRequest = statusCode === HttpStatus.BAD_REQUEST;

    const errorCode = this.resolveErrorCode(error.errorCode, isUnAuthorized, isBadRequest);

    const message = isUnAuthorized ? 'Unauthorized key' : error.message || 'UNDEFINED_ERROR_MESSAGE';

    return response.status(statusCode).json({
      statusCode,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private resolveErrorCode(existing: string | undefined, isUnAuthorized: boolean, isBadRequest: boolean): string {
    if (existing) {
      return existing;
    }

    if (isUnAuthorized) {
      return 'UNAUTHORIZED_KEY';
    }

    if (isBadRequest) {
      return 'INVALID_REQUEST';
    }

    return 'UNDEFINED_ERROR_CODE';
  }
}
