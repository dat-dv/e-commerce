/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  /**
   * Paginates database queries using a simplified, user-driven type inference approach.
   *
   * Why: Prisma's complex delegate return types make it difficult for deep generic structures to automatic-infer relation fields (such as 'include' or 'select' payloads) without dropping them down to scalar-only types. By accepting the args and items type parameter directly, we let TypeScript infer from call-site argument typing (e.g. satisfies / explicit types) while maintaining robust, type-safe joined results.
   *
   * @param model Prisma delegate model containing findMany and count operations.
   * @param args Arguments passed to the findMany operation.
   * @param page Target page number (1-indexed).
   * @param limit Maximum items to retrieve per page.
   */
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
