import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(userId: string, languageCode = 'vi') {
    return this.cartRepository.upsertCart(userId, languageCode);
  }
}
