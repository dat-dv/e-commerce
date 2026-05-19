/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  async paginate<
    TArgs = any,
    TItems = unknown,
    TModel extends {
      findMany: (args: any) => Promise<any>;
      count: (args: any) => Promise<number>;
    } = any,
  >(
    model: TModel,
    args: TArgs,
    page = 1,
    limit = 10,
  ): Promise<{
    items: unknown extends TItems
      ? TModel extends { findMany: (args: any) => Promise<infer TDefaultItems> }
        ? TDefaultItems
        : any
      : TItems;
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
      model.count({
        where: (args as any)?.where,
      }),
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
