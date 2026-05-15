import { ICartResponse, ICartItemResponse } from '@ecommerce/shared';
import { AddToCartDto, UpdateCartItemDto } from '../../dto/cart.dto';

export interface ICartRepository {
  getCart(userId: string, languageCode?: string): Promise<ICartResponse | null>;
  createCart(userId: string, languageCode?: string): Promise<ICartResponse>;
  upsertCart(userId: string, languageCode?: string): Promise<ICartResponse>;
  addItem(cartId: string, data: AddToCartDto): Promise<ICartItemResponse>;
  upsertItem(cartId: string, data: AddToCartDto): Promise<ICartItemResponse>;
  updateItem(itemId: string, data: UpdateCartItemDto): Promise<ICartItemResponse>;
  removeItem(itemId: string): Promise<ICartItemResponse>;
  findItemById(itemId: string): Promise<ICartItemResponse | null>;
  findItem(cartId: string, skuId: string): Promise<ICartItemResponse | null>;
}

export const ICartRepository = Symbol('ICartRepository');
