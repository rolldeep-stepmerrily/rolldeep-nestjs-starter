import { TypedQueryBus } from '@@cqrs';
import { Injectable } from '@nestjs/common';
import { GetUsersQuery, PaginatedUsers } from 'src/users/application/queries/get-users.query';
import { UserEntity } from 'src/users/entities/user.entity';
import { GetUsersMetaDto, GetUsersResponseDto } from 'src/users/presenter/http/dto/get-users.dto';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly queryBus: TypedQueryBus<GetUsersQuery>) {}

  /**
   * 유저 목록 조회
   *
   * @param {GetUsersUseCaseProps} props 조회 조건 (페이지, 페이지당 개수)
   * @returns {Promise<GetUsersUseCaseResult>} 유저 목록 응답과 페이지네이션 메타 정보
   */
  async execute(props: GetUsersUseCaseProps): Promise<GetUsersUseCaseResult> {
    const { page, limit } = props;

    const { items, total } = await this.getUsers(page, limit);

    return {
      users: this.buildResponseDto(items),
      meta: GetUsersMetaDto.from(total, page, limit),
    };
  }

  /**
   * 유저 목록 조회
   *
   * @param {number} page 페이지 번호
   * @param {number} limit 페이지당 조회 개수
   * @returns {Promise<PaginatedUsers>} 유저 엔티티 목록과 전체 개수
   */
  private async getUsers(page: number, limit: number): Promise<PaginatedUsers> {
    return await this.queryBus.execute(new GetUsersQuery({ page, limit }));
  }

  /**
   * 응답 DTO 생성
   *
   * @param {UserEntity[]} users 유저 엔티티 목록
   * @returns {GetUsersResponseDto[]} 응답 데이터
   */
  private buildResponseDto(users: UserEntity[]): GetUsersResponseDto[] {
    return users.map((user) => GetUsersResponseDto.from(user));
  }
}

interface GetUsersUseCaseProps {
  page: number;
  limit: number;
}

interface GetUsersUseCaseResult {
  users: GetUsersResponseDto[];
  meta: GetUsersMetaDto;
}
