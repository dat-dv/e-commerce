import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProduct } from '../entities/product.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<IProduct | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findMany(params: {
    category_id?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
  }): Promise<IProduct[]> {
    const products = await this.prisma.product.findMany({
      where: {
        category_id: params.category_id,
        deleted_at: null,
      },
      orderBy: params.orderBy,
      take: params.take,
    });

    return products;
  }

  async getUserTopCategory(userId: string): Promise<string | null> {
    const result = await this.prisma.userBrowsingHistory.groupBy({
      by: ['product_id'],
      where: { user_id: userId },
      _count: {
        product_id: true,
      },
      orderBy: {
        _count: {
          product_id: 'desc',
        },
      },
      take: 1,
    });

    if (result.length === 0) return null;

    const product = await this.prisma.product.findUnique({
      where: { id: result[0].product_id },
      select: { category_id: true },
    });

    return product?.category_id || null;
  }

  async getActiveFlashSale(): Promise<any> {
    const now = new Date();
    const flashSale = await this.prisma.flashSale.findFirst({
      where: {
        start_time: { lte: now },
        end_time: { gte: now },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return flashSale;
  }

  async getRecentlyViewed(userId: string, take = 10): Promise<IProduct[]> {
    const history = await this.prisma.userBrowsingHistory.findMany({
      where: { user_id: userId },
      orderBy: { viewed_at: 'desc' },
      take: take,
      include: { product: true },
    });

    const products: IProduct[] = [];
    const seenIds = new Set<string>();

    for (const item of history) {
      if (item.product && !seenIds.has(item.product.id)) {
        seenIds.add(item.product.id);
        products.push(item.product);
      }
      if (products.length >= take) {
        break;
      }
    }

    return products;
  }

  async findPaginated(params: { page: number; limit: number; search?: string; category_id?: string }): Promise<{
    data: IProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, search, category_id } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deleted_at: null,
    };

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where.name = {
        contains: search,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
