import { ENotificationType, EOrderStatus, IOrderItemSnapshot, IOrderResponse } from '@ecommerce/shared';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { ICartRepository } from 'src/api/cart/domain/entities/cart.repository.interface';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { OrderItemSnapshotTransformer } from '../../dto/order-item-snapshot.transformer';
import { IOrdersRepository } from '../entities/orders.repository.interface';

interface IOrderItemInput {
  sku_id: string;
  quantity: number;
  price: number;
  flash_sale_id?: string;
  snapshot?: IOrderItemSnapshot;
}

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Chịu trách nhiệm xử lý toàn bộ quy trình đặt hàng và thanh toán.
   *
   * Quy trình xử lý:
   *
   * 1. Xác thực địa chỉ giao hàng
   *    - Người dùng bắt buộc phải chọn địa chỉ giao hàng khi checkout.
   *    - Nếu request không có `shipping_address_id` thì dừng xử lý và trả lỗi.
   *    - Kiểm tra địa chỉ có tồn tại và thuộc về người dùng hiện tại hay không.
   *
   * 2. Tải thông tin giỏ hàng và đối chiếu sản phẩm cần thanh toán.
   * 3. Mở Database Transaction để xử lý các bước quan trọng.
   * 4. Xóa sản phẩm đang checkout khỏi giỏ hàng để tránh đặt trùng.
   * 5. Tải dữ liệu SKU và Flash Sale theo dạng batch.
   * 6. Kiểm tra tồn kho, tính giá cuối và tạo snapshot sản phẩm.
   * 7. Trừ tồn kho.
   * 8. Tạo đơn hàng với tổng tiền cuối cùng.
   * 9. Sau khi transaction thành công, gửi thông báo xác nhận đơn hàng.
   */
  async execute(
    userId: string,
    data: { cartItemIds: string[]; shippingAddressId?: string; promoCode?: string },
  ): Promise<IOrderResponse> {
    const { cartItemIds, shippingAddressId, promoCode } = data;
    const uniqueCartItemIds = Array.from(new Set(cartItemIds));

    if (uniqueCartItemIds.length === 0) {
      throw new BadRequestException('No cart items selected for checkout');
    }

    // Người dùng bắt buộc phải chọn địa chỉ giao hàng khi checkout.
    if (!shippingAddressId) {
      throw new BadRequestException('Shipping address is required');
    }

    // Kiểm tra địa chỉ có tồn tại và thuộc về người dùng hiện tại hay không.
    const address = await this.prisma.shippingAddress.findFirst({
      where: { id: shippingAddressId, user_id: userId },
    });

    if (!address) {
      throw new BadRequestException('Shipping address not found or does not belong to user');
    }

    const finalShippingAddressId = shippingAddressId;

    // Kéo dữ liệu giỏ hàng trước khi mở transaction để giảm thiểu thời gian khóa hàng (row-level locking) trên DB.
    const cart = await this.cartRepository.getCart(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const selectedItems = cart.items.filter((item) => uniqueCartItemIds.includes(item.id));
    if (selectedItems.length !== uniqueCartItemIds.length) {
      throw new BadRequestException('Some selected cart items are no longer available. Please refresh your cart.');
    }

    // Mở transaction với timeout được kéo dài (10s) nhằm phòng ngừa trường hợp đơn hàng quá phức tạp
    // (nhiều món, áp coupon) bị rollback oan uổng khi hệ thống đang chịu tải cao.
    const order = await this.prisma.$transaction(
      async (tx) => {
        const now = new Date();
        let subTotal = 0;
        const orderItems: IOrderItemInput[] = [];

        const transactionCartItems = await tx.cartItem.findMany({
          where: {
            id: { in: uniqueCartItemIds },
            cart: { user_id: userId },
          },
          include: { sku: true },
        });

        if (transactionCartItems.length !== uniqueCartItemIds.length) {
          throw new BadRequestException('Some selected cart items are no longer available. Please refresh your cart.');
        }

        // Xóa ngay lập tức các mặt hàng đã thanh toán khỏi giỏ để chặn đứng rủi ro double-spending (mua đúp) khi có request đồng thời.
        const deletedCartItems = await tx.cartItem.deleteMany({
          where: {
            id: { in: uniqueCartItemIds },
            cart: { user_id: userId },
          },
        });

        if (deletedCartItems.count !== uniqueCartItemIds.length) {
          throw new BadRequestException('Some selected cart items are no longer available. Please refresh your cart.');
        }

        const skuIds = transactionCartItems.map((item) => item.sku_id);

        // Định nghĩa sẵn cấu trúc lấy dữ liệu (include) nhằm đảm bảo payload JSON snapshot
        // luôn lưu giữ đầy đủ chuỗi ngôn ngữ gốc tại thời điểm mua, phục vụ cho lịch sử đơn hàng bất biến.
        const skuInclude = {
          product: {
            include: { thumbnail: true, translations: true },
          },
          sku_attribute_values: {
            include: {
              attribute_value: {
                include: { attribute: true },
              },
            },
          },
        } satisfies Prisma.SkuInclude;

        // Ưu tiên gom nhóm (batch fetch) dữ liệu Flash Sale để kiểm tra giới hạn khuyến mãi,
        // triệt tiêu rủi ro bán lố (overselling) khi có hàng ngàn user cùng chốt đơn 1 lúc.
        const flashSaleProducts = await tx.flashSaleProduct.findMany({
          where: {
            sku_id: { in: skuIds },
            stock: { gt: 0 },
            flash_sale: {
              start_time: { lte: now },
              end_time: { gte: now },
            },
          },
          include: { sku: { include: skuInclude } },
        });

        const flashSaleProductMap = new Map(flashSaleProducts.map((fsp) => [fsp.sku_id, fsp]));
        const skuIdsWithoutFlashSale = skuIds.filter((id) => !flashSaleProductMap.has(id));

        // Fallback về SKU của danh mục tiêu chuẩn cho những mặt hàng không nằm trong chiến dịch khuyến mãi nào.
        let standardSkus: (typeof flashSaleProducts)[number]['sku'][] = [];
        if (skuIdsWithoutFlashSale.length > 0) {
          standardSkus = await tx.sku.findMany({
            where: { id: { in: skuIdsWithoutFlashSale } },
            include: skuInclude,
          });
        }

        const standardSkuMap = new Map(standardSkus.map((sku) => [sku.id, sku]));

        const flashSaleUpdates: Prisma.PrismaPromise<unknown>[] = [];
        const skuUpdates: Prisma.PrismaPromise<unknown>[] = [];

        // Tính toán giá tiền và khởi tạo payload database hoàn toàn trên RAM (in-memory).
        // Phá vỡ nút thắt cổ chai N+1 query, thu hẹp tối đa thời gian mở transaction.
        for (const cartItem of transactionCartItems) {
          const flashSaleProduct = flashSaleProductMap.get(cartItem.sku_id);

          let finalPrice = 0;
          let flashSaleId: string | undefined = undefined;
          let snapshot: IOrderItemSnapshot | undefined = undefined;

          if (flashSaleProduct) {
            // Chốt chặn 1: Tuyệt đối không để tồn kho của pool Flash Sale rơi xuống số âm.
            if (flashSaleProduct.stock < cartItem.quantity) {
              throw new BadRequestException(
                `Insufficient flash sale stock for SKU ${flashSaleProduct.sku.sku_code} (only ${flashSaleProduct.stock} units left)`,
              );
            }

            // Chốt chặn 2: Đảm bảo tồn kho vật lý của tổng kho đủ khả năng đáp ứng cho phần cấp phát của khuyến mãi.
            if (flashSaleProduct.sku.stock < cartItem.quantity) {
              throw new BadRequestException(`Product ${flashSaleProduct.sku.sku_code} is out of stock in warehouse`);
            }

            finalPrice = flashSaleProduct.sale_price;
            flashSaleId = flashSaleProduct.id;

            // Cắt bỏ các siêu dữ liệu không cần thiết (vd: timestamps) để tối ưu dung lượng JSON khi lưu vào DB.
            snapshot = OrderItemSnapshotTransformer.serialize(flashSaleProduct.sku);

            // Xếp hàng lệnh trừ kho. Phải trừ ở cả 2 pool (khuyến mãi & vật lý) để đồng bộ sự thật dữ liệu toàn cầu (global truth).
            flashSaleUpdates.push(
              tx.flashSaleProduct.update({
                where: { id: flashSaleProduct.id },
                data: {
                  stock: { decrement: cartItem.quantity },
                  sold_count: { increment: cartItem.quantity },
                },
              }),
            );

            skuUpdates.push(
              tx.sku.update({
                where: { id: cartItem.sku_id },
                data: { stock: { decrement: cartItem.quantity } },
              }),
            );
          } else {
            const sku = standardSkuMap.get(cartItem.sku_id);

            if (!sku) {
              throw new BadRequestException(`Product (ID: ${cartItem.sku_id}) no longer exists`);
            }

            if (sku.stock < cartItem.quantity) {
              throw new BadRequestException(`Product ${sku.sku_code} is out of stock`);
            }

            finalPrice = sku.price;
            snapshot = OrderItemSnapshotTransformer.serialize(sku);

            skuUpdates.push(
              tx.sku.update({
                where: { id: cartItem.sku_id },
                data: { stock: { decrement: cartItem.quantity } },
              }),
            );
          }

          subTotal += finalPrice * cartItem.quantity;
          orderItems.push({
            sku_id: cartItem.sku_id,
            quantity: cartItem.quantity,
            price: finalPrice,
            flash_sale_id: flashSaleId,
            snapshot,
          });
        }

        // Bắn đồng loạt (concurrently) tất cả các lệnh trừ kho đã xếp hàng nhằm đạt băng thông đọc/ghi I/O cao nhất.
        if (flashSaleUpdates.length > 0 || skuUpdates.length > 0) {
          await Promise.all(flashSaleUpdates.concat(skuUpdates));
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

        // Finalize the order record directly using the transaction client to prevent connection deadlocks
        const order = await tx.order.create({
          data: {
            user_id: userId,
            total_amount: totalAmount,
            discount_amount: discountAmount,
            shipping_address_id: finalShippingAddressId,
            coupon_id: appliedCouponId,
            status: EOrderStatus.PENDING,
            items: {
              create: orderItems.map((item) => ({
                sku_id: item.sku_id,
                quantity: item.quantity,
                price: item.price,
                flash_sale_id: item.flash_sale_id,
                // Cast is safe: IOrderItemSnapshot is a plain JSON-serializable object
                snapshot: item.snapshot as Prisma.InputJsonValue | undefined,
              })),
            },
          },
          include: { items: true },
        });

        return order;
      },
      {
        timeout: 10000,
      },
    );

    try {
      await this.notificationService.sendToUser(
        userId,
        'Đặt hàng thành công',
        `Đơn hàng #${order.id.slice(-6).toUpperCase()} của bạn đã được tiếp nhận.`,
        ENotificationType.ORDER,
        {
          orderId: order.id,
          link: `/orders/${order.id}`,
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order confirmation notification for order ${order.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    return order;
  }
}
