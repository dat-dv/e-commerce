import { ICart, ICartItem } from '@ecommerce/shared';

export interface ICartRepository {
  getCart(userId: string): Promise<ICart | null>;
  createCart(userId: string): Promise<ICart>;
  addItem(cartId: string, skuId: string, quantity: number): Promise<ICartItem>;
  updateItem(itemId: string, quantity: number): Promise<ICartItem>;
  removeItem(itemId: string): Promise<ICartItem>;
  findItemById(itemId: string): Promise<ICartItem | null>;
  findItem(cartId: string, skuId: string): Promise<ICartItem | null>;
}

export const ICartRepository = Symbol('ICartRepository');
