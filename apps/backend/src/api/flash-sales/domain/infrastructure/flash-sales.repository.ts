import { FlashSaleTimeSlot, IFlashSale } from '@ecommerce/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateFlashSaleDto } from '../../dto/create-flash-sale.dto';
import { IFlashSalesRepository } from '../entities/flash-sales.repository.interface';

@Injectable()
export class FlashSalesRepository implements IFlashSalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFlashSaleDto): Promise<IFlashSale> {
    return this.prisma.flashSale.create({
      data: {
        name: data.name,
        start_time: new Date(data.start_time),
        end_time: new Date(data.end_time),
        time_slot_id: data.time_slot_id || null,
        products: {
          create: data.products.map((p) => ({
            sku_id: p.sku_id,
            sale_price: p.sale_price,
            stock: p.stock,
            order_limit: p.order_limit ?? 1,
          })),
        },
      },
      include: {
        products: {
          include: {
            sku: true,
          },
        },
        time_slot: true,
      },
    });
  }

  async findTimeSlotById(id: string): Promise<FlashSaleTimeSlot | null> {
    return this.prisma.flashSaleTimeSlot.findUnique({
      where: { id },
    });
  }
}
