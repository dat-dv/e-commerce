import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { ICartResponse } from '@ecommerce/shared';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(userId: string, skuId: string, quantity: number): Promise<ICartResponse | null> {
    // 1. Tìm hoặc tạo giỏ hàng (sử dụng upsert để đảm bảo atomic operation)
    const cart = await this.cartRepository.upsertCart(userId);

    // 2. Thêm hoặc cập nhật số lượng item (sử dụng upsert)
    await this.cartRepository.upsertItem(cart.id, skuId, quantity);

    // Trả về giỏ hàng mới nhất
    return this.cartRepository.getCart(userId);
  }
}
