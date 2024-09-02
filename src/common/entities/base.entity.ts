import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class BaseEntity {
  @ApiProperty({ description: '생성일자' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: '수정일자' })
  @IsOptional()
  @IsDate()
  updatedAt: Date | null;

  @ApiProperty({ description: '삭제일자' })
  @IsOptional()
  @IsDate()
  deletedAt: Date | null;
}
