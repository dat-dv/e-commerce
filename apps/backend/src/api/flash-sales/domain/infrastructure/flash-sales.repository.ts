import { FlashSaleTimeSlot, IFlashSale } from '@ecommerce/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { AddProductsToFlashSaleDto } from '../../dto/add-products-to-flash-sale.dto';
import { CreateFlashSaleDto, CreateFlashSalesBatchDto } from '../../dto/create-flash-sale.dto';
import { CreateTimeSlotDto, CreateTimeSlotsBatchDto } from '../../dto/create-time-slot.dto';
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

  async createFlashSalesBatch(data: CreateFlashSalesBatchDto): Promise<IFlashSale[]> {
    return this.prisma.$transaction(
      data.flash_sales.map((item) =>
        this.prisma.flashSale.create({
          data: {
            name: item.name,
            start_time: new Date(item.start_time),
            end_time: new Date(item.end_time),
            time_slot_id: item.time_slot_id || null,
            products: {
              create: item.products.map((p) => ({
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
        }),
      ),
    );
  }

  async findFlashSaleById(id: string): Promise<IFlashSale | null> {
    return this.prisma.flashSale.findUnique({
      where: { id },
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

  async addProductsToFlashSale(flashSaleId: string, data: AddProductsToFlashSaleDto): Promise<IFlashSale> {
    return this.prisma.flashSale.update({
      where: { id: flashSaleId },
      data: {
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

  async createTimeSlot(data: CreateTimeSlotDto): Promise<FlashSaleTimeSlot> {
    return this.prisma.flashSaleTimeSlot.create({
      data: {
        name: data.name,
        start_hour: data.start_hour,
        start_minute: data.start_minute ?? 0,
        end_hour: data.end_hour,
        end_minute: data.end_minute ?? 59,
        is_active: data.is_active ?? true,
      },
    });
  }

  async createTimeSlotsBatch(data: CreateTimeSlotsBatchDto): Promise<{ count: number }> {
    return this.prisma.flashSaleTimeSlot.createMany({
      data: data.slots.map((s) => ({
        name: s.name,
        start_hour: s.start_hour,
        start_minute: s.start_minute ?? 0,
        end_hour: s.end_hour,
        end_minute: s.end_minute ?? 59,
        is_active: s.is_active ?? true,
      })),
    });
  }

  async findAllFlashSales(): Promise<IFlashSale[]> {
    return this.prisma.flashSale.findMany({
      include: {
        products: {
          include: {
            sku: true,
          },
        },
        time_slot: true,
      },
      orderBy: {
        start_time: 'desc',
      },
    });
  }

  async findAllTimeSlots(): Promise<FlashSaleTimeSlot[]> {
    return this.prisma.flashSaleTimeSlot.findMany({
      orderBy: [{ start_hour: 'asc' }, { start_minute: 'asc' }],
    });
  }
}
