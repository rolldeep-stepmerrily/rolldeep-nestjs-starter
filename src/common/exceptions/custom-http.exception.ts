import { HttpException, HttpStatus } from '@nestjs/common';

interface ICustomHttpExceptionProps {
  statusCode: HttpStatus;
  errorCode: string;
  message: string;
}

export class CustomHttpException extends HttpException {
  constructor({ statusCode, errorCode, message }: ICustomHttpExceptionProps) {
    super({ statusCode, errorCode, message }, statusCode);
  }
}
