import { appRequest } from "@/constants/app-request";
import { CartRepository } from "../infrastructure/cart.repository";
import { AddToCartUseCase } from "./add-to-cart.use-case";
import { GetCartUseCase } from "./get-cart.use-case";
import { RemoveFromCartUseCase } from "./remove-from-cart.use-case";
import { UpdateCartItemUseCase } from "./update-cart-item.use-case";

const repo = new CartRepository(appRequest);

export const cartUseCase = {
  getCart: new GetCartUseCase(repo),
  addItem: new AddToCartUseCase(repo),
  updateItem: new UpdateCartItemUseCase(repo),
  removeItem: new RemoveFromCartUseCase(repo),
};
