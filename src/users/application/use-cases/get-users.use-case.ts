import { TypedQueryBus } from '@@cqrs';
import { Injectable } from '@nestjs/common';
import { GetUsersQuery } from 'src/users/application/queries/get-users.query';
import { UserEntity } from 'src/users/entities/user.entity';
import { GetUsersResponseDto } from 'src/users/presenter/http/dto/get-users.dto';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly queryBus: TypedQueryBus<GetUsersQuery>) {}

  /**
   * 유저 목록 조회
   *
   * @param {GetUsersUseCaseProps} props 조회 조건
   * @returns {Promise<GetUsersResponseDto[]>} 유저 목록 응답
   */
  async execute(props: GetUsersUseCaseProps): Promise<GetUsersResponseDto[]> {
    const { limit } = props;

    const users = await this.getUsers(limit);

    return this.buildResponseDto(users);
  }

  /**
   * 유저 목록 조회
   *
   * @param {number} limit 조회 개수
   * @returns {Promise<UserEntity[]>} 유저 엔티티 목록
   */
  private async getUsers(limit: number): Promise<UserEntity[]> {
    return await this.queryBus.execute(new GetUsersQuery({ limit }));
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
  limit: number;
}
