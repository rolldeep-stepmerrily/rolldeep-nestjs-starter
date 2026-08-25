import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateUserRequestDto {
  @ApiProperty({ description: '아이디 (영문 6~12자)' })
  @IsString()
  @Matches(/^[A-Za-z]{6,12}$/, { message: '아이디는 영문 6~12자로 입력해주세요.' })
  loginId!: string;

  @ApiProperty({ description: '비밀번호 (영문 대소문자 + 숫자 + 특수문자 포함, 8~20자)' })
  @IsString()
  @Matches(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`])[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,20}$/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8~20자로 입력해주세요.',
  })
  password!: string;

  @ApiProperty({ description: '이메일' })
  @IsEmail()
  email!: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ description: '유저 ID' })
  id!: number;

  @ApiProperty({ description: '아이디' })
  loginId!: string;

  @ApiProperty({ description: '이메일' })
  email!: string;

  @ApiProperty({ description: '생성일' })
  createdAt!: Date;

  /**
   * 유저 엔티티를 응답 DTO로 변환
   *
   * @param {UserEntity} user 변환할 유저 엔티티
   * @returns {CreateUserResponseDto} 변환된 응답 DTO
   */
  static from(user: UserEntity): CreateUserResponseDto {
    return {
      id: user.id,
      loginId: user.loginId,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
