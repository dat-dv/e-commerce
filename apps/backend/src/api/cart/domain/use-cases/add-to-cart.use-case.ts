import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(userId: string, skuId: string, quantity: number) {
    let cart = await this.cartRepository.getCart(userId);
    if (!cart) {
      const newCart = await this.cartRepository.createCart(userId);
      cart = { ...newCart, items: [] };
    }

    const existingItem = await this.cartRepository.findItem(cart.id, skuId);
    if (existingItem) {
      return this.cartRepository.updateItem(existingItem.id, existingItem.quantity + quantity);
    }

    return this.cartRepository.addItem(cart.id, skuId, quantity);
  }
}
