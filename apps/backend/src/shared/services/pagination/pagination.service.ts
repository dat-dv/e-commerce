import { Injectable } from '@nestjs/common';

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PrismaModelDelegate {
  findMany(args?: any): Promise<any[]>;
  count(args?: any): Promise<number>;
}

@Injectable()
export class PaginationService {
  async paginate<T>(
    prismaModel: PrismaModelDelegate,
    queryArgs: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prismaModel.findMany({
        ...queryArgs,
        skip,
        take,
      }),
      prismaModel.count({ where: queryArgs.where as Record<string, unknown> }),
    ]);

    return {
      items: data as T[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
