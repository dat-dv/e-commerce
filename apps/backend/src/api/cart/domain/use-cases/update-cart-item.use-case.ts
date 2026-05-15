import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

import { UpdateCartItemDto } from '../../dto/cart.dto';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(itemId: string, data: UpdateCartItemDto) {
    if (data.quantity <= 0) {
      return this.cartRepository.removeItem(itemId);
    }

    // 1. Lấy thông tin SKU từ cart item
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        sku: { select: { stock: true } },
      },
    });

    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }

    // 2. Kiểm tra tồn kho
    if (data.quantity > cartItem.sku.stock) {
      throw new BadRequestException(`Requested quantity exceeds available stock (Stock: ${cartItem.sku.stock})`);
    }

    return this.cartRepository.updateItem(itemId, data);
  }
}
