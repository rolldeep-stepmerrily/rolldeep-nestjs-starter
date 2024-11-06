import { HttpStatus } from '@nestjs/common';

export const GLOBAL_ERRORS = {
  VERSION_LOG_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'VERSION_LOG_NOT_FOUND',
    message: 'Cannot GET /version-log',
  },
  INVALID_POSITIVE_INT: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'INVALID_POSITIVE_INT',
    message: 'Invalid positive integer',
  },
  UNKNOWN_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'UNKNOWN_ERROR',
    message: '알 수 없는 에러가 발생하였습니다.',
  },
  DATABASE_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'DATABASE_ERROR',
    message: '데이터베이스 에러가 발생하였습니다.',
  },
};
