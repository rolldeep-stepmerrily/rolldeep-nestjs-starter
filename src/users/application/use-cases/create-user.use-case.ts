import { TypedCommandBus } from '@@cqrs';
import { Injectable } from '@nestjs/common';
import { CreateUserCommand, CreateUserCommandProps } from 'src/users/application/commands/create-user.command';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserResponseDto } from 'src/users/presenter/http/dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly commandBus: TypedCommandBus<CreateUserCommand>) {}

  /**
   * 유저 생성
   *
   * @param {CreateUserUseCaseProps} props 생성 정보
   * @returns {Promise<CreateUserResponseDto>} 생성된 유저 응답
   */
  async execute(props: CreateUserUseCaseProps): Promise<CreateUserResponseDto> {
    const { loginId, password, email } = props;

    const user = await this.createUser({ loginId, password, email });

    return this.buildResponseDto(user);
  }

  /**
   * 유저 생성 커맨드 실행
   *
   * @param {CreateUserCommandProps} props 생성 정보
   * @returns {Promise<UserEntity>} 생성된 유저 엔티티
   */
  private async createUser(props: CreateUserCommandProps): Promise<UserEntity> {
    return await this.commandBus.execute(new CreateUserCommand(props));
  }

  /**
   * 응답 DTO 생성
   *
   * @param {UserEntity} user 유저 엔티티
   * @returns {CreateUserResponseDto} 응답 데이터
   */
  private buildResponseDto(user: UserEntity): CreateUserResponseDto {
    return CreateUserResponseDto.from(user);
  }
}

interface CreateUserUseCaseProps {
  loginId: string;
  password: string;
  email: string;
}
