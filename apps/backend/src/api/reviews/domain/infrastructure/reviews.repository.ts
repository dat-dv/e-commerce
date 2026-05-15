import { Injectable } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IReviewResponse, IReviewListResponse } from '@ecommerce/shared';

@Injectable()
export class ReviewsRepository implements IReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    product_id: string;
    sku_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    images?: string[];
  }): Promise<IReviewResponse> {
    return this.prisma.review.create({
      data: {
        ...data,
        images: data.images,
      },
    });
  }

  async update(id: string, data: { rating?: number; comment?: string; images?: string[] }): Promise<IReviewResponse> {
    return this.prisma.review.update({
      where: { id },
      data: {
        ...data,
        images: data.images,
      },
    });
  }

  async findAll(): Promise<IReviewListResponse> {
    return this.prisma.review.findMany();
  }

  async findByProduct(productId: string): Promise<IReviewListResponse> {
    return this.prisma.review.findMany({
      where: { product_id: productId },
    });
  }

  async delete(id: string): Promise<IReviewResponse> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<IReviewResponse | null> {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: { select: { role_name: true } } },
    });
    return user?.role?.role_name === 'ADMIN';
  }

  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: {
          select: {
            permissions: {
              where: { permission: { permission_name: permissionName } },
              select: { permission: { select: { permission_name: true } } },
            },
          },
        },
      },
    });
    return (user?.role?.permissions?.length ?? 0) > 0;
  }
}
