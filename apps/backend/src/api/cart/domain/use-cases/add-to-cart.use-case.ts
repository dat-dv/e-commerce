import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, skuId: string, quantity: number) {
    // 1. Kiểm tra tồn kho của SKU trước
    const sku = await this.prisma.sku.findUnique({
      where: { id: skuId },
      select: { stock: true, sku_code: true },
    });

    if (!sku) {
      throw new BadRequestException('Product not found');
    }

    let cart = await this.cartRepository.getCart(userId);
    if (!cart) {
      const newCart = await this.cartRepository.createCart(userId);
      cart = { ...newCart, items: [] };
    }

    const existingItem = await this.cartRepository.findItem(cart.id, skuId);
    const newTotalQuantity = (existingItem?.quantity || 0) + quantity;

    // 2. Validate tổng số lượng sau khi thêm có vượt quá kho không
    if (newTotalQuantity > sku.stock) {
      throw new BadRequestException(
        `Requested quantity exceeds available stock (Stock: ${sku.stock}, in cart: ${existingItem?.quantity || 0})`,
      );
    }

    if (existingItem) {
      return this.cartRepository.updateItem(existingItem.id, newTotalQuantity);
    }

    return this.cartRepository.addItem(cart.id, skuId, quantity);
  }
}
