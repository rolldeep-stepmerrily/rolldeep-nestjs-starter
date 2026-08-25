import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponse {
  @ApiProperty({ description: 'HTTP 상태 코드' })
  statusCode!: HttpStatus;

  @ApiProperty({ description: '에러 코드' })
  errorCode!: string;

  @ApiProperty({ description: '에러 메시지' })
  message!: string;

  @ApiProperty({ description: '에러 발생 시각' })
  timestamp!: string;

  @ApiProperty({ description: '요청 경로' })
  path!: string;
}
