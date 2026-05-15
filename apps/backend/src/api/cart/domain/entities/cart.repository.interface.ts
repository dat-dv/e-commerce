import { ICartResponse, ICartItemResponse } from '@ecommerce/shared';

export interface ICartRepository {
  getCart(userId: string, languageCode?: string): Promise<ICartResponse | null>;
  createCart(userId: string, languageCode?: string): Promise<ICartResponse>;
  upsertCart(userId: string, languageCode?: string): Promise<ICartResponse>;
  addItem(cartId: string, skuId: string, quantity: number): Promise<ICartItemResponse>;
  updateItem(itemId: string, quantity: number): Promise<ICartItemResponse>;
  upsertItem(cartId: string, skuId: string, quantity: number): Promise<ICartItemResponse>;
  removeItem(itemId: string): Promise<ICartItemResponse>;
  findItemById(itemId: string): Promise<ICartItemResponse | null>;
  findItem(cartId: string, skuId: string): Promise<ICartItemResponse | null>;
}

export const ICartRepository = Symbol('ICartRepository');
