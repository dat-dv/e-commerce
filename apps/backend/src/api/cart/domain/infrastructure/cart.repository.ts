import { Injectable } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { ICartResponse, ICartItemResponse } from '@ecommerce/shared';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string, languageCode = 'vi'): Promise<ICartResponse | null> {
    return this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            sku: {
              include: {
                product: {
                  include: {
                    translations: {
                      where: { language: { code: languageCode } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createCart(userId: string, languageCode = 'vi'): Promise<ICartResponse> {
    return this.prisma.cart.create({
      data: { user_id: userId },
      include: {
        items: {
          include: {
            sku: {
              include: {
                product: {
                  include: {
                    translations: {
                      where: { language: { code: languageCode } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async upsertCart(userId: string, languageCode = 'vi'): Promise<ICartResponse> {
    return this.prisma.cart.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
      include: {
        items: {
          include: {
            sku: {
              include: {
                product: {
                  include: {
                    translations: {
                      where: { language: { code: languageCode } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }
  async addItem(cartId: string, skuId: string, quantity: number): Promise<ICartItemResponse> {
    return this.prisma.cartItem.create({
      data: { cart_id: cartId, sku_id: skuId, quantity },
      include: { sku: true },
    });
  }

  async upsertItem(cartId: string, skuId: string, quantity: number): Promise<ICartItemResponse> {
    return this.prisma.cartItem.upsert({
      where: {
        cart_id_sku_id: {
          cart_id: cartId,
          sku_id: skuId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cart_id: cartId,
        sku_id: skuId,
        quantity,
      },
      include: { sku: true },
    });
  }

  async updateItem(itemId: string, quantity: number): Promise<ICartItemResponse> {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { sku: true },
    });
  }

  async removeItem(itemId: string): Promise<ICartItemResponse> {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
      include: { sku: true },
    });
  }

  async findItemById(itemId: string): Promise<ICartItemResponse | null> {
    return this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { sku: true },
    });
  }

  async findItem(cartId: string, skuId: string): Promise<ICartItemResponse | null> {
    return this.prisma.cartItem.findUnique({
      where: {
        cart_id_sku_id: {
          cart_id: cartId,
          sku_id: skuId,
        },
      },
      include: { sku: true },
    });
  }
}
