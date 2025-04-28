import { HttpException, HttpStatus } from '@nestjs/common';

interface IAppExceptionProps {
  statusCode: HttpStatus;
  errorCode: string;
  message: string;
}

export class AppException extends HttpException {
  constructor({ statusCode, errorCode, message }: IAppExceptionProps) {
    super({ statusCode, errorCode, message }, statusCode);
  }
}
