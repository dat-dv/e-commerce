import { Cart, CartItem } from 'generated/prisma/client';

export interface ICartRepository {
  getCart(userId: string): Promise<(Cart & { items: CartItem[] }) | null>;
  createCart(userId: string): Promise<Cart>;
  addItem(cartId: string, skuId: string, quantity: number): Promise<CartItem>;
  updateItem(itemId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<CartItem>;
  findItem(cartId: string, skuId: string): Promise<CartItem | null>;
}

export const ICartRepository = Symbol('ICartRepository');
