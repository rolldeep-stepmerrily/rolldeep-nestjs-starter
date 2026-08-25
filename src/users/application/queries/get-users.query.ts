import { PrismaService } from '@@db';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from 'src/users/entities/user.entity';

export interface PaginatedUsers {
  items: UserEntity[];
  total: number;
}

export class GetUsersQuery extends Query<PaginatedUsers> {
  constructor(public readonly props: GetUsersQueryProps) {
    super();
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUsersQuery): Promise<PaginatedUsers> {
    const { page, limit } = query.props;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return { items, total };
  }
}

export interface GetUsersQueryProps {
  page: number;
  limit: number;
}
