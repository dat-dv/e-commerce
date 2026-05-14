import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { ICartRepository } from 'src/api/cart/domain/entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

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

    // Prioritize provided shipping address or fallback to default to ensure deliverability
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
      // Isolate selected items and verify the user's intent matches their current cart state
      const cart = await this.cartRepository.getCart(userId);
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const selectedItems = cart.items.filter((item) => cartItemIds.includes(item.id));
      if (selectedItems.length === 0) {
        throw new BadRequestException('No valid cart items selected for checkout');
      }

      const now = new Date();
      let subTotal = 0;
      const orderItems: IOrderItemInput[] = [];

      // Process each item to lock in pricing and decrement inventory to prevent overselling
      for (const cartItem of selectedItems) {
        // Check for active flash sale participation to apply promotional pricing and specific stock pools
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
          // Handle flash sale inventory locking
          if (flashSaleProduct.stock < cartItem.quantity) {
            throw new BadRequestException(
              `Insufficient flash sale stock for SKU ${flashSaleProduct.sku.sku_code} (only ${flashSaleProduct.stock} units left)`,
            );
          }

          // Verify physical warehouse stock can accommodate the flash sale allocation
          if (flashSaleProduct.sku.stock < cartItem.quantity) {
            throw new BadRequestException(`Product ${flashSaleProduct.sku.sku_code} is out of stock in warehouse`);
          }

          finalPrice = flashSaleProduct.sale_price;
          flashSaleId = flashSaleProduct.id;

          // Decrement flash sale pool
          await tx.flashSaleProduct.update({
            where: { id: flashSaleProduct.id },
            data: {
              stock: { decrement: cartItem.quantity },
              sold_count: { increment: cartItem.quantity },
            },
          });

          // Synchronize total SKU stock to reflect global availability
          await tx.sku.update({
            where: { id: cartItem.sku_id },
            data: { stock: { decrement: cartItem.quantity } },
          });
        } else {
          // Fallback to standard pricing and inventory when no flash sale is applicable
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

          // Lock inventory at the standard SKU level
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

      // Apply promotional codes and validate usage limits/expiration
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

        // Apply discount based on type (percentage vs fixed)
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

        // Cap discount at subtotal to prevent negative order totals
        if (discountAmount > subTotal) {
          discountAmount = subTotal;
        }

        appliedCouponId = coupon.id;

        // Record coupon usage to enforce limits
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { used_count: { increment: 1 } },
        });
      }

      const totalAmount = subTotal - discountAmount;

      // Finalize the order record in the database
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

      // Evict purchased items from the cart to synchronize session state
      await tx.cartItem.deleteMany({
        where: { id: { in: cartItemIds } },
      });

      return order;
    });
  }
}
