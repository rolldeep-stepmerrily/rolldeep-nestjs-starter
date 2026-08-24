import { HttpStatus } from '@nestjs/common';

export const GLOBAL_ERRORS = {
  INVALID_POSITIVE_INT: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'INVALID_POSITIVE_INT',
    message: 'Invalid positive integer',
  },
  UNKNOWN_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'UNKNOWN_ERROR',
    message: 'Unknown error',
  },
  DATABASE_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'DATABASE_ERROR',
    message: 'Database error',
  },
};
