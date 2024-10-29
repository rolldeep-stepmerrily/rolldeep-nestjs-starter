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
};
