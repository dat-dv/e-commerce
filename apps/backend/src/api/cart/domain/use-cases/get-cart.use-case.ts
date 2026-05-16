import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { ICartResponse } from '@ecommerce/shared';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(userId: string, languageCode = 'vi'): Promise<ICartResponse | null> {
    return this.cartRepository.getCart(userId, languageCode);
  }
}
