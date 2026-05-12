import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(userId: string) {
    const cart = await this.cartRepository.getCart(userId);
    if (!cart) {
      // Create cart if not exists
      const newCart = await this.cartRepository.createCart(userId);
      return { ...newCart, items: [] };
    }
    return cart;
  }
}
