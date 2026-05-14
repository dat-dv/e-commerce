import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(itemId: string) {
    const item = await this.cartRepository.findItemById(itemId);

    if (!item) {
      return null;
    }

    return this.cartRepository.removeItem(itemId);
  }
}
