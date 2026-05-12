import { Injectable } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });
  }

  async createCart(userId: string) {
    return this.prisma.cart.create({
      data: { user_id: userId },
    });
  }

  async addItem(cartId: string, skuId: string, quantity: number) {
    return this.prisma.cartItem.create({
      data: { cart_id: cartId, sku_id: skuId, quantity },
    });
  }

  async updateItem(itemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async findItem(cartId: string, skuId: string) {
    return this.prisma.cartItem.findUnique({
      where: { cart_id_sku_id: { cart_id: cartId, sku_id: skuId } },
    });
  }
}
