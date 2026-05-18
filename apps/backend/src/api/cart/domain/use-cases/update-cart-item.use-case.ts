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

  async execute(itemId: string, data: UpdateCartItemDto): Promise<boolean> {
    if (data.quantity <= 0) {
      try {
        await this.cartRepository.removeItem(itemId);
        return true;
      } catch (error) {
        return true;
      }
    }

    // 1. Fetch the SKU and stock information from the cart item
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        sku: { select: { stock: true } },
      },
    });

    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }

    // 2. Validate stock constraints
    if (data.quantity > cartItem.sku.stock) {
      throw new BadRequestException(`Requested quantity exceeds available stock (Stock: ${cartItem.sku.stock})`);
    }

    await this.cartRepository.updateItem(itemId, data);
    return true;
  }
}
