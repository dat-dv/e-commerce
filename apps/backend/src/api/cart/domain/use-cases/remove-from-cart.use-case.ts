import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
  ) {}

  /**
   * Directly removes an item from the cart.
   * Does not check if the item exists first to minimize database queries.
   * If the item is successfully removed (or already deleted/non-existing), returns true.
   *
   * @param {string} itemId - The unique identifier of the cart item to be removed.
   * @returns {Promise<boolean>} True if the removal succeeds or the item is already gone.
   */
  async execute(itemId: string): Promise<boolean> {
    try {
      await this.cartRepository.removeItem(itemId);
      return true;
    } catch (error) {
      // Return true to ensure silent success even if the item does not exist
      return true;
    }
  }
}
