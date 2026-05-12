import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.cartRepository.removeItem(itemId);
    }
    return this.cartRepository.updateItem(itemId, quantity);
  }
}
