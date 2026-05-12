import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(itemId: string) {
    return this.cartRepository.removeItem(itemId);
  }
}
