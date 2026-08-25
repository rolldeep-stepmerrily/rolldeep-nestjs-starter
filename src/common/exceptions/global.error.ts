import { HttpStatus } from '@nestjs/common';

export const GLOBAL_ERRORS = {
  VALIDATION_ERROR: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'VALIDATION_ERROR',
    message: 'Validation failed',
  },
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
  DUPLICATE_LOGIN_ID: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATE_LOGIN_ID',
    message: 'Login id already exists',
  },
  DUPLICATE_EMAIL: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATE_EMAIL',
    message: 'Email already exists',
  },
};
