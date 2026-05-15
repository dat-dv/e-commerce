import { Prisma, CartItem } from '../../../../../generated/prisma/client';

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        sku: {
          include: {
            product: {
              include: { translations: true };
            };
          };
        };
      };
    };
  };
}>;

export interface ICartRepository {
  getCart(userId: string, languageCode?: string): Promise<CartWithItems | null>;
  createCart(userId: string, languageCode?: string): Promise<CartWithItems>;
  upsertCart(userId: string, languageCode?: string): Promise<CartWithItems>;
  addItem(cartId: string, skuId: string, quantity: number): Promise<CartItem>;
  updateItem(itemId: string, quantity: number): Promise<CartItem>;
  upsertItem(cartId: string, skuId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<CartItem>;
  findItemById(itemId: string): Promise<CartItem | null>;
  findItem(cartId: string, skuId: string): Promise<CartItem | null>;
}

export const ICartRepository = Symbol('ICartRepository');
