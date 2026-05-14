import { IOrder, IOrderItem } from "../types/order.model";
import { ProductMapper } from "@/domain/products/infrastructure/products.mapper";
import { IProduct } from "@ecommerce/shared";

export interface IOrderItemDTO {
  id: string;
  sku_id: string;
  quantity: number;
  price: number;
  flash_sale_id?: string;
  sku?: {
    id: string;
    sku_code: string;
    image_url?: string;
    product?: IProduct;
  };
}

export interface IOrderDTO {
  id: string;
  status: number;
  total_amount: number;
  discount_amount: number;
  items: IOrderItemDTO[];
  created_at: string;
  updated_at: string;
}

export class OrderMapper {
  static toDomain(dto: IOrderDTO): IOrder {
    return {
      id: dto.id,
      status: dto.status,
      totalAmount: dto.total_amount,
      discountAmount: dto.discount_amount,
      items: dto.items?.map(OrderMapper.toOrderItemDomain) || [],
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  private static toOrderItemDomain(dto: IOrderItemDTO): IOrderItem {
    return {
      id: dto.id,
      skuId: dto.sku_id,
      quantity: dto.quantity,
      price: dto.price,
      flashSaleId: dto.flash_sale_id,
      sku: dto.sku
        ? {
            id: dto.sku.id,
            skuCode: dto.sku.sku_code,
            imageUrl: dto.sku.image_url,
            product: dto.sku.product
              ? ProductMapper.toDomain(dto.sku.product)
              : undefined,
          }
        : undefined,
    };
  }
}
