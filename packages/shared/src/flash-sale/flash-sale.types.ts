import { FlashSale, FlashSaleTimeSlot, FlashSaleProduct, Sku } from "../index";

export interface IFlashSaleProduct extends FlashSaleProduct {
  sku?: Sku;
}

export interface IFlashSale extends FlashSale {
  time_slot?: FlashSaleTimeSlot | null;
  products: IFlashSaleProduct[];
}
