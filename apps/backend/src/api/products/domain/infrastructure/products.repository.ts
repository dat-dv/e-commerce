import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProduct } from '../entities/product.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

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
    // 1. Tìm sản phẩm được xem nhiều nhất bởi user
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

    // 2. Lấy category của sản phẩm đó
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
}
