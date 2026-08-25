import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface IErrorResponse {
  message: string | string[];
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

    const message = isUnAuthorized ? 'Unauthorized key' : this.normalizeMessage(error.message);

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

  /**
   * ValidationPipe 등에서 배열로 전달될 수 있는 메시지를 하나의 문자열로 정규화
   *
   * @param {string | string[]} message 원본 에러 메시지
   * @returns {string} 정규화된 에러 메시지
   */
  private normalizeMessage(message: string | string[]): string {
    if (Array.isArray(message)) {
      return message.length > 0 ? message.join(', ') : 'UNDEFINED_ERROR_MESSAGE';
    }

    return message || 'UNDEFINED_ERROR_MESSAGE';
  }
}
