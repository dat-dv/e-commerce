import { IOrder } from "../types/order.model";

export interface IOrderDTO {
  id: string;
  status: number;
  total_amount: number;
  discount_amount: number;
  created_at: string;
}

export class OrderMapper {
  static toDomain(dto: IOrderDTO): IOrder {
    return {
      id: dto.id,
      status: dto.status,
      totalAmount: dto.total_amount,
      discountAmount: dto.discount_amount,
      createdAt: new Date(dto.created_at),
    };
  }
}
