import { PrismaClient } from '../../generated/prisma/client';
import { SeedRegistry } from './registry';

const CATEGORY_TREE = [
  {
    name: 'Đồ Công Nghệ',
    slug: 'do-cong-nghe',
    description: 'Các sản phẩm điện tử và công nghệ',
    children: [
      { name: 'Điện thoại', slug: 'dien-thoai', description: 'Điện thoại thông minh các thương hiệu' },
      { name: 'Laptop', slug: 'laptop', description: 'Máy tính xách tay cho học tập và làm việc' },
      { name: 'Máy tính bảng', slug: 'may-tinh-bang', description: 'Tablet và iPad các loại' },
      { name: 'Tai nghe', slug: 'tai-nghe', description: 'Tai nghe không dây và có dây' },
      { name: 'Loa', slug: 'loa', description: 'Loa bluetooth và loa thùng' },
      { name: 'Đồng hồ thông minh', slug: 'dong-ho-thong-minh', description: 'Smartwatch theo dõi sức khỏe' },
      { name: 'Máy ảnh', slug: 'may-anh', description: 'Máy ảnh DSLR, mirrorless và compact' },
      { name: 'Màn hình máy tính', slug: 'man-hinh-may-tinh', description: 'Màn hình văn phòng và gaming' },
      { name: 'Bàn phím & Chuột', slug: 'ban-phim-chuot', description: 'Bàn phím cơ, chuột gaming' },
      { name: 'Phụ kiện công nghệ', slug: 'phu-kien-cong-nghe', description: 'Cáp, sạc, ốp lưng, dán màn hình' },
    ],
  },
  {
    name: 'Thời Trang',
    slug: 'thoi-trang',
    description: 'Quần áo, giày dép và phụ kiện thời trang',
    children: [
      { name: 'Áo nam', slug: 'ao-nam', description: 'Áo sơ mi, thun, khoác nam' },
      { name: 'Quần nam', slug: 'quan-nam', description: 'Quần jeans, khaki, short nam' },
      { name: 'Áo nữ', slug: 'ao-nu', description: 'Áo blouse, thun, khoác nữ' },
      { name: 'Váy đầm', slug: 'vay-dam', description: 'Váy và đầm nữ các loại' },
      { name: 'Giày nam', slug: 'giay-nam', description: 'Giày sneaker, da, thể thao nam' },
      { name: 'Giày nữ', slug: 'giay-nu', description: 'Giày cao gót, sandal, sneaker nữ' },
      { name: 'Túi xách & Balo', slug: 'tui-xach-balo', description: 'Túi xách nữ, balo, clutch' },
      { name: 'Phụ kiện thời trang', slug: 'phu-kien-thoi-trang', description: 'Mũ, thắt lưng, khăn, kính mắt' },
    ],
  },
  {
    name: 'Đồ Gia Dụng',
    slug: 'do-gia-dung',
    description: 'Thiết bị và đồ dùng trong gia đình',
    children: [
      { name: 'Tủ lạnh', slug: 'tu-lanh', description: 'Tủ lạnh các thương hiệu và dung tích' },
      { name: 'Máy giặt', slug: 'may-giat', description: 'Máy giặt cửa trên và cửa trước' },
      { name: 'Điều hòa', slug: 'dieu-hoa', description: 'Điều hòa inverter tiết kiệm điện' },
      { name: 'Máy lọc không khí', slug: 'may-loc-khong-khi', description: 'Máy lọc không khí và tạo ẩm' },
      { name: 'Đồ dùng nhà bếp', slug: 'do-dung-nha-bep', description: 'Nồi, chảo, dao kéo và đồ bếp' },
      { name: 'Đồ dùng phòng ngủ', slug: 'do-dung-phong-ngu', description: 'Chăn, gối, ga trải giường' },
      { name: 'Đồ dùng phòng tắm', slug: 'do-dung-phong-tam', description: 'Khăn tắm, phụ kiện nhà tắm' },
    ],
  },
  {
    name: 'Thể Thao & Dã Ngoại',
    slug: 'the-thao-da-ngoai',
    description: 'Dụng cụ thể thao, tập gym và hoạt động ngoài trời',
    children: [
      { name: 'Dụng cụ tập gym', slug: 'dung-cu-tap-gym', description: 'Tạ, dây kháng lực, thảm yoga' },
      { name: 'Đồ thể thao', slug: 'do-the-thao', description: 'Quần áo và giày thể thao' },
      { name: 'Bóng đá', slug: 'bong-da', description: 'Bóng, giày đá banh, găng tay thủ môn' },
      { name: 'Bơi lội', slug: 'boi-loi', description: 'Kính bơi, áo bơi, mũ bơi' },
      { name: 'Xe đạp & Phụ kiện', slug: 'xe-dap', description: 'Xe đạp thể thao, leo núi, đường phố' },
      { name: 'Cắm trại & Leo núi', slug: 'cam-trai-leo-nui', description: 'Lều, ba lô, đèn pin, dao đa năng' },
    ],
  },
  {
    name: 'Sách & Văn Phòng Phẩm',
    slug: 'sach-van-phong-pham',
    description: 'Sách, tài liệu và đồ dùng văn phòng',
    children: [
      { name: 'Sách văn học', slug: 'sach-van-hoc', description: 'Tiểu thuyết, truyện ngắn, thơ' },
      { name: 'Sách kỹ năng', slug: 'sach-ky-nang', description: 'Sách phát triển bản thân và kỹ năng' },
      { name: 'Sách kinh tế', slug: 'sach-kinh-te', description: 'Sách kinh doanh, tài chính, đầu tư' },
      { name: 'Sách thiếu nhi', slug: 'sach-thieu-nhi', description: 'Truyện tranh và sách cho trẻ em' },
      { name: 'Sách học ngoại ngữ', slug: 'sach-hoc-ngoai-ngu', description: 'Giáo trình tiếng Anh, Nhật, Hàn' },
      { name: 'Văn phòng phẩm', slug: 'van-phong-pham', description: 'Bút, vở, kẹp, bìa hồ sơ' },
    ],
  },
  {
    name: 'Mẹ & Bé',
    slug: 'me-va-be',
    description: 'Sản phẩm dành cho mẹ bầu và trẻ nhỏ',
    children: [
      { name: 'Xe đẩy & Địu em bé', slug: 'xe-day-dia-em-be', description: 'Xe đẩy và địu cho bé' },
      { name: 'Đồ chơi trẻ em', slug: 'do-choi-tre-em', description: 'Đồ chơi giáo dục và vui chơi' },
      { name: 'Quần áo trẻ em', slug: 'quan-ao-tre-em', description: 'Quần áo cho bé sơ sinh đến 10 tuổi' },
      { name: 'Sữa & Dinh dưỡng', slug: 'sua-va-dinh-duong', description: 'Sữa bột và thực phẩm dinh dưỡng cho bé' },
      { name: 'Chăm sóc bé', slug: 'cham-soc-be', description: 'Tã, bỉm, sữa tắm, phấn rôm' },
    ],
  },
  {
    name: 'Làm Đẹp & Sức Khỏe',
    slug: 'lam-dep-suc-khoe',
    description: 'Mỹ phẩm, chăm sóc da và sản phẩm sức khỏe',
    children: [
      { name: 'Chăm sóc da mặt', slug: 'cham-soc-da-mat', description: 'Serum, kem dưỡng, toner, mặt nạ' },
      { name: 'Trang điểm', slug: 'trang-diem', description: 'Son môi, phấn, mascara, eyeliner' },
      { name: 'Nước hoa', slug: 'nuoc-hoa', description: 'Nước hoa nam và nữ các thương hiệu' },
      { name: 'Chăm sóc tóc', slug: 'cham-soc-toc', description: 'Dầu gội, dầu xả, serum tóc' },
      { name: 'Thực phẩm chức năng', slug: 'thuc-pham-chuc-nang', description: 'Vitamin và thực phẩm bổ sung' },
    ],
  },
  {
    name: 'Thực Phẩm & Đồ Uống',
    slug: 'thuc-pham-do-uong',
    description: 'Thực phẩm tươi sống, đóng gói và đồ uống',
    children: [
      { name: 'Đặc sản vùng miền', slug: 'dac-san-vung-mien', description: 'Đặc sản 3 miền Bắc Trung Nam' },
      { name: 'Trà & Cà phê', slug: 'tra-va-ca-phe', description: 'Trà xanh, trà ô long, cà phê rang xay' },
      { name: 'Bánh kẹo & Snack', slug: 'banh-keo-snack', description: 'Bánh ngọt, kẹo và snack các loại' },
      { name: 'Bia & Rượu', slug: 'bia-ruou', description: 'Bia, rượu vang và nước giải khát' },
    ],
  },
];

export async function seedCategories(prisma: PrismaClient) {
  console.log('--- Phase: Product Categories ---');

  // Fetch languages from registry
  const vi = await SeedRegistry.getLanguage(prisma, 'vi');
  const en = await SeedRegistry.getLanguage(prisma, 'en');

  let parentCreated = 0;
  let childCreated = 0;

  for (const group of CATEGORY_TREE) {
    const { children, name, description, ...groupData } = group;

    // 2. Upsert nhóm (level 1)
    const parent = await prisma.productCategory.upsert({
      where: { slug: groupData.slug },
      update: { level: 1, parent_id: null },
      create: { ...groupData, level: 1, parent_id: null },
    });

    // 3. Seed translation cho nhóm
    // Model: productCategoryTranslation (được sinh ra từ model ProductCategoryTranslation)
    await prisma.productCategoryTranslation.upsert({
      where: {
        category_id_language_id: {
          category_id: parent.id,
          language_id: vi.id,
        },
      },
      update: {
        name,
        description,
      },
      create: {
        category_id: parent.id,
        language_id: vi.id,
        name,
        description,
      },
    });

    parentCreated++;

    // 3. Upsert các danh mục con (level 2)
    for (const child of children) {
      const { name: childName, description: childDesc, ...childData } = child;

      const category = await prisma.productCategory.upsert({
        where: { slug: childData.slug },
        update: { level: 2, parent_id: parent.id },
        create: { ...childData, level: 2, parent_id: parent.id },
      });

      // 4. Seed translation cho danh mục con
      await prisma.productCategoryTranslation.upsert({
        where: {
          category_id_language_id: {
            category_id: category.id,
            language_id: vi.id,
          },
        },
        update: {
          name: childName,
          description: childDesc,
        },
        create: {
          category_id: category.id,
          language_id: vi.id,
          name: childName,
          description: childDesc,
        },
      });

      childCreated++;
    }
  }

  console.log(
    `✅ Categories: ${parentCreated} nhóm + ${childCreated} danh mục con (tổng ${parentCreated + childCreated})`,
  );
}
