import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from './success-response';

/**
 * 반환할 데이터가 없는 엔드포인트를 위한 성공 응답
 */
export class EmptySuccessResponse extends SuccessResponse<null> {
  @ApiProperty({ description: '반환 데이터 없음', nullable: true, default: null })
  declare data: null;
}
