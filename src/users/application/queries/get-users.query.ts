import { PrismaService } from '@@db';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from 'src/users/entities/user.entity';

export class GetUsersQuery extends Query<UserEntity[]> {
  constructor(public readonly props: GetUsersQueryProps) {
    super();
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUsersQuery): Promise<UserEntity[]> {
    const { limit } = query.props;

    return await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
    });
  }
}

export interface GetUsersQueryProps {
  limit: number;
}
