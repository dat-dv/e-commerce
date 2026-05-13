import { PrismaClient } from '../../generated/prisma/client';
import { TOP_BRANDS_DATA } from './top-brands.data';

export async function updateTopBrands(prisma: PrismaClient) {
  console.log('\n🔄 Đang tối ưu danh sách Top Brands (20 cái)...');

  // 1. Lấy toàn bộ Brand kèm số lượng sản phẩm
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      slug: true,
      _count: {
        select: { products: true },
      },
    },
  });

  // 2. Danh sách slug của các "ông lớn" cần giữ chân
  const bigNameSlugs = TOP_BRANDS_DATA.map((b) => b.slug);

  // 3. Sắp xếp theo tiêu chí: Ông lớn trước -> Số lượng sản phẩm sau
  const sortedBrands = brands.sort((a, b) => {
    const aIsBig = bigNameSlugs.includes(a.slug);
    const bIsBig = bigNameSlugs.includes(b.slug);

    if (aIsBig && !bIsBig) return -1;
    if (!aIsBig && bIsBig) return 1;

    const aCount = a._count?.products || 0;
    const bCount = b._count?.products || 0;
    return bCount - aCount;
  });

  // 4. Lấy Top 20
  const top20 = sortedBrands.slice(0, 20);

  // 5. Reset toàn bộ và cập nhật lại
  await prisma.brand.updateMany({
    data: { is_featured: false, order: 999 },
  });

  for (let i = 0; i < top20.length; i++) {
    await prisma.brand.update({
      where: { id: top20[i].id },
      data: {
        is_featured: true,
        order: i,
      },
    });
  }

  console.log(`✅ Đã chốt danh sách 20 Top Brands.`);
}
