import { Injectable } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { EOrderStatus, IReviewResponse, IReviewListResponse } from '@ecommerce/shared';
import { CreateReviewInputDto } from '../../dto/create-review-input.dto';
import { UpdateReviewDto } from '../../dto/update-review.dto';

@Injectable()
export class ReviewsRepository implements IReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly REVIEW_INCLUDE = {
    user: {
      include: {
        avatar: true,
      },
    },
  };

  async create(data: CreateReviewInputDto): Promise<IReviewResponse> {
    return this.prisma.review.create({
      data: {
        ...data,
        images: data.images,
      },
      include: this.REVIEW_INCLUDE,
    });
  }

  async update(id: string, data: UpdateReviewDto): Promise<IReviewResponse> {
    return this.prisma.review.update({
      where: { id },
      data: {
        ...data,
        images: data.images,
      },
      include: this.REVIEW_INCLUDE,
    });
  }

  async findAll(): Promise<IReviewListResponse> {
    return this.prisma.review.findMany({
      include: this.REVIEW_INCLUDE,
    });
  }

  async findByProduct(productId: string): Promise<IReviewListResponse> {
    return this.prisma.review.findMany({
      where: { product_id: productId },
      include: this.REVIEW_INCLUDE,
    });
  }

  async delete(id: string): Promise<IReviewResponse> {
    return this.prisma.review.delete({
      where: { id },
      include: this.REVIEW_INCLUDE,
    });
  }

  async findById(id: string): Promise<IReviewResponse | null> {
    return this.prisma.review.findUnique({
      where: { id },
      include: this.REVIEW_INCLUDE,
    });
  }

  async isSkuInProduct(productId: string, skuId: string): Promise<boolean> {
    const sku = await this.prisma.sku.findFirst({
      where: {
        id: skuId,
        product_id: productId,
      },
      select: { id: true },
    });

    return !!sku;
  }

  async hasDeliveredPurchase(userId: string, productId: string, skuId: string): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: {
        user_id: userId,
        status: EOrderStatus.DELIVERED,
        items: {
          some: {
            sku_id: skuId,
            sku: {
              product_id: productId,
            },
          },
        },
      },
      select: { id: true },
    });

    return !!order;
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
