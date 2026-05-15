/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  async paginate<
    TDelegate extends {
      findMany: (...args: any[]) => any;
      count?: (...args: any[]) => any;
    },
    TArgs extends Parameters<TDelegate['findMany']>[0],
    TResult extends Awaited<ReturnType<TDelegate['findMany']>>,
  >(
    model: TDelegate,
    args: TArgs,
    page = 1,
    limit = 10,
  ): Promise<{
    items: TResult;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      model.findMany({
        ...args,
        skip,
        take: limit,
      }),
      model?.count?.({
        where: (args as any)?.where,
      }) ?? 0,
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
