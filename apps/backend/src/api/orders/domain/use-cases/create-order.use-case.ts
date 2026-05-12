import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { ICartRepository } from 'src/api/cart/domain/entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { OrderStatus } from '../entities/order-status.enum';

interface IOrderItemInput {
  sku_id: string;
  quantity: number;
  price: number;
  flash_sale_id?: string;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, shippingAddressId?: string) {
    // 0. Kiểm tra địa chỉ giao hàng nếu có cung cấp
    if (shippingAddressId) {
      const address = await this.prisma.shippingAddress.findFirst({
        where: { id: shippingAddressId, user_id: userId },
      });
      if (!address) {
        throw new BadRequestException('Shipping address not found or does not belong to user');
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Lấy giỏ hàng
      const cart = await this.cartRepository.getCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const now = new Date();
      let totalAmount = 0;
      const orderItems: IOrderItemInput[] = [];

      // 2. Xử lý từng item trong giỏ hàng
      for (const cartItem of cart.items) {
        // Kiểm tra xem SKU có đang trong Flash Sale không
        const flashSaleProduct = await tx.flashSaleProduct.findFirst({
          where: {
            sku_id: cartItem.sku_id,
            stock: { gt: 0 },
            flash_sale: {
              start_time: { lte: now },
              end_time: { gte: now },
            },
          },
          include: {
            sku: true,
          },
        });

        let finalPrice = 0;
        let flashSaleId: string | undefined = undefined;

        if (flashSaleProduct) {
          // A. Có Flash Sale và còn hàng
          if (flashSaleProduct.stock < cartItem.quantity) {
            throw new BadRequestException(
              `Insufficient flash sale stock for SKU ${flashSaleProduct.sku.sku_code} (only ${flashSaleProduct.stock} units left)`,
            );
          }

          // Kiểm tra tồn kho thực tế của SKU
          if (flashSaleProduct.sku.stock < cartItem.quantity) {
            throw new BadRequestException(`Product ${flashSaleProduct.sku.sku_code} is out of stock in warehouse`);
          }

          finalPrice = flashSaleProduct.sale_price;
          flashSaleId = flashSaleProduct.id;

          // Cập nhật tồn kho Flash Sale
          await tx.flashSaleProduct.update({
            where: { id: flashSaleProduct.id },
            data: {
              stock: { decrement: cartItem.quantity },
              sold_count: { increment: cartItem.quantity },
            },
          });

          // Cập nhật tồn kho tổng của SKU
          await tx.sku.update({
            where: { id: cartItem.sku_id },
            data: { stock: { decrement: cartItem.quantity } },
          });
        } else {
          // B. Không có Flash Sale hoặc hết hàng Flash Sale -> Dùng giá gốc
          const sku = await tx.sku.findUnique({
            where: { id: cartItem.sku_id },
          });

          if (!sku) {
            throw new BadRequestException(`Product (ID: ${cartItem.sku_id}) no longer exists`);
          }

          if (sku.stock < cartItem.quantity) {
            throw new BadRequestException(`Product ${sku.sku_code} is out of stock`);
          }

          finalPrice = sku.price;

          // Cập nhật tồn kho tổng của SKU
          await tx.sku.update({
            where: { id: cartItem.sku_id },
            data: { stock: { decrement: cartItem.quantity } },
          });
        }

        totalAmount += finalPrice * cartItem.quantity;
        orderItems.push({
          sku_id: cartItem.sku_id,
          quantity: cartItem.quantity,
          price: finalPrice,
          flash_sale_id: flashSaleId,
        });
      }

      // 3. Tạo đơn hàng
      const order = await tx.order.create({
        data: {
          user_id: userId,
          total_amount: totalAmount,
          shipping_address_id: shippingAddressId,
          status: OrderStatus.PENDING,
          items: {
            create: orderItems.map((item) => ({
              sku_id: item.sku_id,
              quantity: item.quantity,
              price: item.price,
              flash_sale_id: item.flash_sale_id,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 4. Xóa các items trong giỏ hàng (giữ lại record Cart)
      await tx.cartItem.deleteMany({
        where: { cart: { user_id: userId } },
      });

      return order;
    });
  }
}
