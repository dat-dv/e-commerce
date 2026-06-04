import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { ICartResponse } from '@ecommerce/shared';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(userId: string, languageCode = DEFAULT_LANGUAGE_CODE): Promise<ICartResponse | null> {
    return this.cartRepository.getCart(userId, languageCode);
  }
}
