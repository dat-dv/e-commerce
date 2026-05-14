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

  async execute(userId: string, data: { cartItemIds: string[]; shippingAddressId?: string; promoCode?: string }) {
    const { cartItemIds, shippingAddressId, promoCode } = data;

    // 0. Xác định địa chỉ giao hàng
    let finalShippingAddressId = shippingAddressId;
    if (!finalShippingAddressId) {
      const defaultAddress = await this.prisma.shippingAddress.findFirst({
        where: { user_id: userId, is_default: true },
      });
      if (!defaultAddress) {
        throw new BadRequestException('No shipping address provided and no default address found');
      }
      finalShippingAddressId = defaultAddress.id;
    } else {
      const address = await this.prisma.shippingAddress.findFirst({
        where: { id: finalShippingAddressId, user_id: userId },
      });
      if (!address) {
        throw new BadRequestException('Shipping address not found or does not belong to user');
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Lấy giỏ hàng và lọc các items được chọn
      const cart = await this.cartRepository.getCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const selectedItems = cart.items.filter((item) => cartItemIds.includes(item.id));
      if (selectedItems.length === 0) {
        throw new BadRequestException('No valid cart items selected for checkout');
      }

      const now = new Date();
      let subTotal = 0;
      const orderItems: IOrderItemInput[] = [];

      // 2. Xử lý từng item trong các item được chọn
      for (const cartItem of selectedItems) {
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

        subTotal += finalPrice * cartItem.quantity;
        orderItems.push({
          sku_id: cartItem.sku_id,
          quantity: cartItem.quantity,
          price: finalPrice,
          flash_sale_id: flashSaleId,
        });
      }

      // 2.5. Áp dụng Coupon nếu có
      let discountAmount = 0;
      let appliedCouponId: string | undefined = undefined;

      if (promoCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: promoCode, is_active: true },
        });

        if (!coupon) {
          throw new BadRequestException('Invalid or inactive promo code');
        }

        if (now < coupon.start_date || now > coupon.end_date) {
          throw new BadRequestException('Promo code is expired');
        }

        if (subTotal < coupon.min_order_amount) {
          throw new BadRequestException(`Minimum order amount for this promo code is ${coupon.min_order_amount}`);
        }

        if (coupon.used_count >= coupon.usage_limit) {
          throw new BadRequestException('Promo code usage limit reached');
        }

        // Tính toán discount
        if (coupon.discount_type === 0) {
          // PERCENTAGE
          discountAmount = (subTotal * coupon.discount_value) / 100;
          if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
            discountAmount = coupon.max_discount_amount;
          }
        } else {
          // FIXED_AMOUNT
          discountAmount = coupon.discount_value;
        }

        // Không cho phép discount > subTotal
        if (discountAmount > subTotal) {
          discountAmount = subTotal;
        }

        appliedCouponId = coupon.id;

        // Cập nhật số lần sử dụng coupon
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { used_count: { increment: 1 } },
        });
      }

      const totalAmount = subTotal - discountAmount;

      // 3. Tạo đơn hàng
      const order = await this.ordersRepository.createOrder({
        user_id: userId,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        shipping_address_id: finalShippingAddressId,
        coupon_id: appliedCouponId,
        items: orderItems.map((item) => ({
          sku_id: item.sku_id,
          quantity: item.quantity,
          price: item.price,
          flash_sale_id: item.flash_sale_id,
        })),
      });

      // 4. Xóa các cart items đã mua
      await tx.cartItem.deleteMany({
        where: { id: { in: cartItemIds } },
      });

      return order;
    });
  }
}
