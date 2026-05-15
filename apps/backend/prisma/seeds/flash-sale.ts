import { PrismaClient } from '../../generated/prisma/client';

export async function seedFlashSales(prisma: PrismaClient) {
  console.log('--- Phase 4: Flash Sales ---');

  // 1. Tạo Time Slots
  const timeSlots = [
    { name: 'Khung giờ sáng', start_hour: 9, start_minute: 0, end_hour: 12, end_minute: 0 },
    { name: 'Sale Giữa Ngày', start_hour: 13, start_minute: 0, end_hour: 17, end_minute: 0 },
    { name: 'Khung Giờ Vàng', start_hour: 19, start_minute: 0, end_hour: 22, end_minute: 0 },
  ];

  let activeSlot: {
    id: string;
    start_hour: number;
    start_minute: number;
    end_hour: number;
    end_minute: number;
  } | null = null;
  for (const slot of timeSlots) {
    activeSlot = await prisma.flashSaleTimeSlot.create({
      data: slot,
    });
  }

  if (!activeSlot) {
    console.error('❌ Không thể tạo FlashSaleTimeSlot');
    return;
  }

  // 2. Tạo một Flash Sale đang diễn ra (Hôm nay)
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(activeSlot.start_hour, activeSlot.start_minute, 0, 0);

  const endTime = new Date(now);
  endTime.setHours(activeSlot.end_hour, activeSlot.end_minute, 0, 0);

  const flashSale = await prisma.flashSale.create({
    data: {
      name: 'Flash Sale Độc Quyền Đêm Nay',
      start_time: startTime,
      end_time: endTime,
      time_slot_id: activeSlot.id,
    },
  });

  // 3. Lấy ngẫu nhiên khoảng 20 SKU để đưa vào Flash Sale
  // Lưu ý: Lấy các SKU có giá cao một chút để sale cho đẹp
  const skus = await prisma.sku.findMany({
    where: {
      price: { gt: 100000 },
    },
    take: 20,
  });

  if (skus.length === 0) {
    // Fallback nếu không có SKU nào giá > 100k
    const allSkus = await prisma.sku.findMany({ take: 20 });
    skus.push(...allSkus);
  }

  const flashSaleProducts = skus.map((sku) => {
    // Giảm giá từ 30% đến 70% cho nó "flash"
    const discount = 0.3 + Math.random() * 0.4;
    const salePrice = Math.floor(sku.price * (1 - discount));

    return {
      flash_sale_id: flashSale.id,
      sku_id: sku.id,
      sale_price: salePrice,
      stock: 100,
      sold_count: Math.floor(Math.random() * 80),
      order_limit: 2,
    };
  });

  await prisma.flashSaleProduct.createMany({
    data: flashSaleProducts,
  });

  console.log(`⚡ Đã tạo Flash Sale "${flashSale.name}" với ${flashSaleProducts.length} sản phẩm đang diễn ra.`);
}
