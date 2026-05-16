import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { ICartItemResponse } from '@ecommerce/shared';
import { AddToCartDto } from '../../dto/cart.dto';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(userId: string, data: AddToCartDto, lang = 'vi'): Promise<ICartItemResponse> {
    // 1. Tìm hoặc tạo giỏ hàng (sử dụng upsert để đảm bảo atomic operation)
    const cart = await this.cartRepository.upsertCart(userId, lang);

    const cartItem = await this.cartRepository.upsertItem(cart.id, data, lang);

    return cartItem;
  }
}
