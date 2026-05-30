import { Injectable } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { ICartResponse, ICartItemResponse } from '@ecommerce/shared';
import { AddToCartDto, UpdateCartItemDto } from '../../dto/cart.dto';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getCartInclude(languageCode: string) {
    return {
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
    };
  }

  async getCart(userId: string, languageCode = 'en'): Promise<ICartResponse | null> {
    return this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: this.getCartInclude(languageCode),
    });
  }

  async createCart(userId: string, languageCode = 'en'): Promise<ICartResponse> {
    return this.prisma.cart.create({
      data: { user_id: userId },
      include: this.getCartInclude(languageCode),
    });
  }

  async upsertCart(userId: string, languageCode = 'en'): Promise<ICartResponse> {
    return this.prisma.cart.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
      include: this.getCartInclude(languageCode),
    });
  }

  private getCartItemInclude(languageCode: string) {
    return {
      sku: {
        include: {
          product: {
            include: {
              thumbnail: true,
              translations: {
                where: { language: { code: languageCode } },
              },
            },
          },
          flash_sales: {
            where: {
              flash_sale: {
                start_time: { lte: new Date() },
                end_time: { gte: new Date() },
              },
            },
          },
        },
      },
    };
  }

  async addItem(cartId: string, data: AddToCartDto, languageCode = 'en'): Promise<ICartItemResponse> {
    return this.prisma.cartItem.create({
      data: {
        cart_id: cartId,
        sku_id: data.sku_id,
        quantity: data.quantity,
      },
      include: this.getCartItemInclude(languageCode),
    });
  }

  async upsertItem(cartId: string, data: AddToCartDto, languageCode = 'en'): Promise<ICartItemResponse> {
    return this.prisma.cartItem.upsert({
      where: {
        cart_id_sku_id: {
          cart_id: cartId,
          sku_id: data.sku_id,
        },
      },
      update: {
        quantity: { increment: data.quantity },
      },
      create: {
        cart_id: cartId,
        sku_id: data.sku_id,
        quantity: data.quantity,
      },
      include: this.getCartItemInclude(languageCode),
    });
  }

  async updateItem(itemId: string, data: UpdateCartItemDto, languageCode = 'en'): Promise<ICartItemResponse> {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: data.quantity },
      include: this.getCartItemInclude(languageCode),
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
