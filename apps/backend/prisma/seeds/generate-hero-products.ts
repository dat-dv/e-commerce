const HERO_PRODUCTS = [
  // APPLE
  {
    name: 'iPhone 15 Pro Max 256GB - Titanium Black',
    main_category: 'electronics',
    sub_category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2070&auto=format&fit=crop',
    link: 'https://www.apple.com/iphone-15-pro/',
    ratings: '4.9',
    no_of_ratings: '15,200',
    discount_price: '₹1,49,900',
    actual_price: '₹1,59,900',
    actual_price_vnd: 45000000,
    discount_price_vnd: 34990000,
    pure_name: 'iPhone 15 Pro Max',
    attributes: 'Titanium Black',
    name_vi: 'iPhone 15 Pro Max 256GB - Titan Đen',
    description_vi:
      'iPhone 15 Pro Max được chế tác từ titan chuẩn hàng không vũ trụ, trang bị chip A17 Pro đột phá và hệ thống camera Pro mạnh mẽ nhất từng có.',
    description_en:
      'iPhone 15 Pro Max forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    brand: 'Apple',
    skus: [
      {
        sku_code: 'APL-I15PM-256-BLK',
        price: 34990000,
        stock: 50,
        attributes: { color: 'Titanium Black', storage: '256GB' },
      },
    ],
    reviews: [
      { rating: 5, comment: 'Đỉnh cao công nghệ, cầm rất nhẹ tay nhờ khung titan.' },
      { rating: 5, comment: 'Camera zoom 5x cực kỳ sắc nét, đáng đồng tiền bát gạo.' },
    ],
  },
  {
    name: 'MacBook Pro 14 M3 Max - 36GB RAM / 1TB SSD',
    main_category: 'electronics',
    sub_category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026&auto=format&fit=crop',
    link: 'https://www.apple.com/macbook-pro/',
    ratings: '5.0',
    no_of_ratings: '3,500',
    discount_price: '₹2,99,900',
    actual_price: '₹3,29,900',
    actual_price_vnd: 89000000,
    discount_price_vnd: 79990000,
    pure_name: 'MacBook Pro 14 M3 Max',
    attributes: 'Space Black',
    name_vi: 'MacBook Pro 14 inch M3 Max - 36GB / 1TB - Space Black',
    description_vi:
      'MacBook Pro trang bị chip M3 Max mang lại hiệu năng cực khủng cho các tác vụ chuyên nghiệp nặng nhất.',
    description_en:
      'MacBook Pro with M3 Max chip. The most advanced chips ever built for a personal computer. Massive performance for the most demanding workflows.',
    brand: 'Apple',
    skus: [
      {
        sku_code: 'APL-MBP14-M3M-BLK',
        price: 79990000,
        stock: 20,
        attributes: { color: 'Space Black', ram: '36GB', ssd: '1TB' },
      },
    ],
    reviews: [{ rating: 5, comment: 'Máy quá mạnh, render video 4K nhanh như chớp.' }],
  },
  // SAMSUNG
  {
    name: 'Samsung Galaxy S24 Ultra 5G - Titanium Gray',
    main_category: 'electronics',
    sub_category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=2070&auto=format&fit=crop',
    link: 'https://www.samsung.com/galaxy-s24-ultra/',
    ratings: '4.8',
    no_of_ratings: '8,900',
    discount_price: '₹1,29,999',
    actual_price: '₹1,39,999',
    actual_price_vnd: 35000000,
    discount_price_vnd: 29990000,
    pure_name: 'Galaxy S24 Ultra',
    attributes: 'Titanium Gray',
    name_vi: 'Samsung Galaxy S24 Ultra 5G - Titan Xám',
    description_vi: 'Galaxy S24 Ultra với quyền năng Galaxy AI, bút S Pen tích hợp và hệ thống camera 200MP đỉnh cao.',
    description_en:
      'Galaxy S24 Ultra with Galaxy AI, built-in S Pen, and the most advanced 200MP camera system on a smartphone.',
    brand: 'Samsung',
    skus: [
      {
        sku_code: 'SS-S24U-512-GRY',
        price: 29990000,
        stock: 45,
        attributes: { color: 'Titanium Gray', storage: '512GB' },
      },
    ],
    reviews: [{ rating: 5, comment: 'Tính năng AI dịch thuật trực tiếp cực kỳ hữu ích.' }],
  },
  // NIKE
  {
    name: 'Nike Air Jordan 1 Retro High OG - Chicago',
    main_category: 'fashion',
    sub_category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
    link: 'https://www.nike.com/jordan',
    ratings: '4.9',
    no_of_ratings: '45,000',
    discount_price: '₹15,995',
    actual_price: '₹15,995',
    actual_price_vnd: 55000000,
    discount_price_vnd: 4800000,
    pure_name: 'Air Jordan 1 Retro High',
    attributes: 'Red/White/Black',
    name_vi: 'Giày Nike Air Jordan 1 Retro High OG - Chicago',
    description_vi:
      'Mẫu giày biểu tượng nhất mọi thời đại, sự kết hợp hoàn hảo giữa văn hóa bóng rổ và phong cách đường phố.',
    description_en: 'The most iconic sneaker of all time. A perfect blend of basketball heritage and street style.',
    brand: 'Nike',
    skus: [
      { sku_code: 'NK-AJ1-CHI-42', price: 4800000, stock: 15, attributes: { color: 'Chicago', size: '42' } },
      { sku_code: 'NK-AJ1-CHI-43', price: 4800000, stock: 12, attributes: { color: 'Chicago', size: '43' } },
    ],
    reviews: [{ rating: 5, comment: 'Huyền thoại! Phối màu Chicago không bao giờ lỗi mốt.' }],
  },
  // SONY
  {
    name: 'Sony PlayStation 5 Console - Slim Edition',
    main_category: 'electronics',
    sub_category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop',
    link: 'https://www.playstation.com/ps5/',
    ratings: '4.9',
    no_of_ratings: '25,000',
    discount_price: '₹44,990',
    actual_price: '₹54,990',
    actual_price_vnd: 16000000,
    discount_price_vnd: 13990000,
    pure_name: 'PlayStation 5 Slim',
    attributes: 'Digital Edition',
    name_vi: 'Máy chơi game Sony PlayStation 5 (PS5) Slim Edition',
    description_vi:
      'Trải nghiệm tốc độ tải nhanh như chớp với ổ SSD siêu tốc, đắm chìm hơn với phản hồi xúc giác và âm thanh 3D.',
    description_en:
      'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    brand: 'Sony',
    skus: [
      { sku_code: 'SNY-PS5-SLM-DIG', price: 13990000, stock: 30, attributes: { version: 'Digital', storage: '1TB' } },
    ],
    reviews: [{ rating: 5, comment: 'Tay cầm DualSense rung phê thực sự.' }],
  },
  // MARSHALL
  {
    name: 'Loa Bluetooth Marshall Emberton II - Black and Brass',
    main_category: 'electronics',
    sub_category: 'Audio',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070&auto=format&fit=crop',
    link: 'https://www.marshallheadphones.com/emberton-ii',
    ratings: '4.8',
    no_of_ratings: '12,000',
    discount_price: '₹14,999',
    actual_price: '₹17,999',
    actual_price_vnd: 4990000,
    discount_price_vnd: 3990000,
    pure_name: 'Marshall Emberton II',
    attributes: 'Black & Brass',
    name_vi: 'Loa Bluetooth Marshall Emberton II - Đen Đồng',
    description_vi:
      'Loa di động Emberton II mang đến âm thanh Marshall bùng nổ, thời lượng pin lên đến 30 giờ và khả năng chống nước IP67.',
    description_en:
      'Emberton II delivers sound that is rich, clear and loud, like the artist intended. Featuring 30+ hours of portable playtime and IP67 dust and water resistance.',
    brand: 'Marshall',
    skus: [{ sku_code: 'MSL-EMB2-BLK', price: 3990000, stock: 60, attributes: { color: 'Black & Brass' } }],
    reviews: [{ rating: 5, comment: 'Nhỏ mà võ công thâm hậu, bass đánh rất sâu.' }],
  },
];

// Tạo script để ghi file
const fs = require('fs');
const path = require('path');
const targetDir = path.join(__dirname, '../dataset/products/Top Brands');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, 'top-brands-hero.json'), JSON.stringify(HERO_PRODUCTS, null, 2));
console.log('✅ Đã tạo file top-brands-hero.json với các siêu phẩm Apple, Samsung, Nike, Sony, Marshall!');
