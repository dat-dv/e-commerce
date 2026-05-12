import { PrismaClient } from '../../generated/prisma/client';

const CATEGORIES = [
  // Điện tử (Electronics)
  { name: 'Điện thoại', slug: 'dien-thoai', description: 'Điện thoại thông minh các thương hiệu' },
  { name: 'Laptop', slug: 'laptop', description: 'Máy tính xách tay cho học tập và làm việc' },
  { name: 'Máy tính bảng', slug: 'may-tinh-bang', description: 'Tablet và iPad các loại' },
  { name: 'Tai nghe', slug: 'tai-nghe', description: 'Tai nghe không dây và có dây' },
  { name: 'Loa', slug: 'loa', description: 'Loa bluetooth và loa thùng' },
  { name: 'Đồng hồ thông minh', slug: 'dong-ho-thong-minh', description: 'Smartwatch theo dõi sức khỏe' },
  { name: 'Máy ảnh', slug: 'may-anh', description: 'Máy ảnh DSLR, mirrorless và compact' },
  { name: 'Màn hình', slug: 'man-hinh', description: 'Màn hình máy tính và gaming' },
  { name: 'Bàn phím', slug: 'ban-phim', description: 'Bàn phím cơ và bàn phím thường' },
  { name: 'Chuột', slug: 'chuot', description: 'Chuột máy tính gaming và văn phòng' },

  // Thời trang (Fashion)
  { name: 'Áo nam', slug: 'ao-nam', description: 'Áo sơ mi, thun, khoác nam' },
  { name: 'Quần nam', slug: 'quan-nam', description: 'Quần jeans, khaki, short nam' },
  { name: 'Áo nữ', slug: 'ao-nu', description: 'Áo blouse, thun, khoác nữ' },
  { name: 'Váy đầm', slug: 'vay-dam', description: 'Váy và đầm nữ các loại' },
  { name: 'Giày nam', slug: 'giay-nam', description: 'Giày sneaker, da, thể thao nam' },
  { name: 'Giày nữ', slug: 'giay-nu', description: 'Giày cao gót, sandal, sneaker nữ' },
  { name: 'Túi xách', slug: 'tui-xach', description: 'Túi xách nữ, balo, clutch' },
  { name: 'Phụ kiện thời trang', slug: 'phu-kien-thoi-trang', description: 'Mũ, thắt lưng, khăn, kính' },

  // Đồ gia dụng (Home Appliances)
  { name: 'Tủ lạnh', slug: 'tu-lanh', description: 'Tủ lạnh các thương hiệu và dung tích' },
  { name: 'Máy giặt', slug: 'may-giat', description: 'Máy giặt cửa trên và cửa trước' },
  { name: 'Điều hòa', slug: 'dieu-hoa', description: 'Điều hòa inverter tiết kiệm điện' },
  { name: 'Máy lọc không khí', slug: 'may-loc-khong-khi', description: 'Máy lọc không khí và tạo ẩm' },
  { name: 'Nồi cơm điện', slug: 'noi-com-dien', description: 'Nồi cơm điện thông minh các loại' },
  { name: 'Máy xay sinh tố', slug: 'may-xay-sinh-to', description: 'Máy xay sinh tố và máy ép hoa quả' },

  // Sách (Books)
  { name: 'Sách văn học', slug: 'sach-van-hoc', description: 'Tiểu thuyết, truyện ngắn, thơ' },
  { name: 'Sách kỹ năng', slug: 'sach-ky-nang', description: 'Sách phát triển bản thân và kỹ năng' },
  { name: 'Sách kinh tế', slug: 'sach-kinh-te', description: 'Sách kinh doanh, tài chính, đầu tư' },
  { name: 'Sách thiếu nhi', slug: 'sach-thieu-nhi', description: 'Truyện tranh và sách cho trẻ em' },
  { name: 'Sách học ngoại ngữ', slug: 'sach-hoc-ngoai-ngu', description: 'Giáo trình tiếng Anh, Nhật, Hàn' },

  // Thể thao (Sports)
  { name: 'Dụng cụ tập gym', slug: 'dung-cu-tap-gym', description: 'Tạ, dây kháng lực, thảm yoga' },
  { name: 'Đồ thể thao', slug: 'do-the-thao', description: 'Quần áo và giày thể thao' },
  { name: 'Bóng đá', slug: 'bong-da', description: 'Bóng, giày đá banh, găng tay thủ môn' },
  { name: 'Bơi lội', slug: 'boi-loi', description: 'Kính bơi, áo bơi, mũ bơi' },
  { name: 'Xe đạp', slug: 'xe-dap', description: 'Xe đạp thể thao, leo núi, đường phố' },

  // Mẹ & Bé (Mom & Baby)
  { name: 'Xe đẩy em bé', slug: 'xe-day-em-be', description: 'Xe đẩy và xe nôi cho bé' },
  { name: 'Đồ chơi trẻ em', slug: 'do-choi-tre-em', description: 'Đồ chơi giáo dục và vui chơi' },
  { name: 'Quần áo trẻ em', slug: 'quan-ao-tre-em', description: 'Quần áo cho bé sơ sinh đến 10 tuổi' },
  { name: 'Sữa và dinh dưỡng', slug: 'sua-va-dinh-duong', description: 'Sữa bột và thực phẩm dinh dưỡng cho bé' },

  // Làm đẹp (Beauty)
  { name: 'Chăm sóc da mặt', slug: 'cham-soc-da-mat', description: 'Serum, kem dưỡng, toner, mặt nạ' },
  { name: 'Trang điểm', slug: 'trang-diem', description: 'Son môi, phấn, mascara, eyeliner' },
  { name: 'Nước hoa', slug: 'nuoc-hoa', description: 'Nước hoa nam và nữ các thương hiệu' },
  { name: 'Chăm sóc tóc', slug: 'cham-soc-toc', description: 'Dầu gội, dầu xả, serum tóc' },

  // Thực phẩm (Food)
  { name: 'Đặc sản vùng miền', slug: 'dac-san-vung-mien', description: 'Đặc sản 3 miền Bắc Trung Nam' },
  { name: 'Thực phẩm chức năng', slug: 'thuc-pham-chuc-nang', description: 'Vitamin và thực phẩm bổ sung' },
  { name: 'Trà và cà phê', slug: 'tra-va-ca-phe', description: 'Trà xanh, trà ô long, cà phê rang xay' },
  { name: 'Bánh kẹo', slug: 'banh-keo', description: 'Bánh ngọt, kẹo và snack các loại' },
];

export async function seedCategories(prisma: PrismaClient) {
  console.log('--- Phase: Product Categories ---');

  let created = 0;
  let skipped = 0;

  for (const cat of CATEGORIES) {
    const exists = await prisma.productCategory.findUnique({ where: { slug: cat.slug } });
    if (!exists) {
      await prisma.productCategory.create({ data: cat });
      created++;
    } else {
      skipped++;
    }
  }

  console.log(`✅ Categories: ${created} created, ${skipped} skipped (total ${CATEGORIES.length})`);
}
