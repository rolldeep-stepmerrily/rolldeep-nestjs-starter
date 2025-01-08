import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsOptional } from 'class-validator';

export class BaseEntity {
  @ApiProperty({ description: 'created at' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'updated at' })
  @IsOptional()
  @IsDate()
  updatedAt: Date | null;

  @ApiProperty({ description: 'deleted at' })
  @IsOptional()
  @IsDate()
  deletedAt: Date | null;
}
