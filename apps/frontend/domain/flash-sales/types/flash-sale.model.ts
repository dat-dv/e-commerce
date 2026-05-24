export type TFlashSaleStatus = "active" | "upcoming" | "ended";

export interface TFlashSaleProduct {
  id: string;
  flashSaleId: string;
  skuId: string;
  skuCode?: string;
  salePrice: number;
  stock: number;
  soldCount: number;
  orderLimit: number;
}

export interface TFlashSaleTimeSlot {
  id: string;
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  isActive: boolean;
}

export interface TCreateTimeSlotInput {
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  isActive: boolean;
}

export interface TFlashSale {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  timeSlotId: string | null;
  timeSlot: TFlashSaleTimeSlot | null;
  products: TFlashSaleProduct[];
}

export interface TCreateFlashSaleProductInput {
  skuId: string;
  salePrice: number;
  stock: number;
  orderLimit?: number;
}

export interface TCreateFlashSaleInput {
  name: string;
  startTime: string;
  endTime: string;
  timeSlotId?: string;
  products: TCreateFlashSaleProductInput[];
}

export interface TAddProductsToFlashSaleInput {
  products: TCreateFlashSaleProductInput[];
}
