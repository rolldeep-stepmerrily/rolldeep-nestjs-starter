import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class GetUsersRequestDto {
  @ApiPropertyOptional({ description: '페이지 번호 (1부터 시작)', default: DEFAULT_PAGE })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({ description: '페이지당 조회 개수', default: DEFAULT_LIMIT, maximum: MAX_LIMIT })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit: number = DEFAULT_LIMIT;
}

export class GetUsersResponseDto {
  @ApiProperty({ description: '유저 ID' })
  id!: number;

  @ApiProperty({ description: '이메일' })
  email!: string;

  @ApiProperty({ description: '생성일' })
  createdAt!: Date;

  /**
   * 유저 엔티티를 응답 DTO로 변환
   *
   * @param {UserEntity} user 변환할 유저 엔티티
   * @returns {GetUsersResponseDto} 변환된 응답 DTO
   */
  static from(user: UserEntity): GetUsersResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export class GetUsersMetaDto {
  @ApiProperty({ description: '전체 유저 수' })
  total!: number;

  @ApiProperty({ description: '현재 페이지' })
  page!: number;

  @ApiProperty({ description: '페이지당 조회 개수' })
  limit!: number;

  /**
   * 페이지네이션 메타 정보 생성
   *
   * @param {number} total 전체 유저 수
   * @param {number} page 현재 페이지
   * @param {number} limit 페이지당 조회 개수
   * @returns {GetUsersMetaDto} 생성된 메타 DTO
   */
  static from(total: number, page: number, limit: number): GetUsersMetaDto {
    return { total, page, limit };
  }
}
