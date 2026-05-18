import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(itemId: string): Promise<boolean> {
    try {
      await this.cartRepository.removeItem(itemId);
      return true;
    } catch (error) {
      // If the item is already gone (Record to delete not found), return true silently
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return true;
      }
      // For any other genuine database or connection failures, throw the error to trigger FE rollback
      throw error;
    }
  }
}
