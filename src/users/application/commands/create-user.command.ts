import { PrismaService } from '@@db';
import { AppException, GLOBAL_ERRORS } from '@@exceptions';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';

const PASSWORD_SALT_ROUNDS = 10;

export class CreateUserCommand extends Command<UserEntity> {
  constructor(public readonly props: CreateUserCommandProps) {
    super();
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const { loginId, password, email } = command.props;

    await this.assertNotDuplicated(loginId, email);

    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

    return await this.prisma.user.create({
      data: { loginId, email, password: hashedPassword },
    });
  }

  private async assertNotDuplicated(loginId: string, email: string): Promise<void> {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ loginId }, { email }], deletedAt: null },
      select: { loginId: true },
    });

    if (!existing) {
      return;
    }

    throw new AppException(
      existing.loginId === loginId ? GLOBAL_ERRORS.DUPLICATE_LOGIN_ID : GLOBAL_ERRORS.DUPLICATE_EMAIL,
    );
  }
}

export interface CreateUserCommandProps {
  loginId: string;
  password: string;
  email: string;
}
