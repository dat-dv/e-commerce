const fs = require('fs');
const path = require('path');

const dir = __dirname;

function enrichProduct(p) {
  const fullName = p.name;
  let pureName = fullName;
  let description = `Product from ${p.main_category}. Original link: ${p.link}`;

  // 1. Làm sạch tên sản phẩm
  if (fullName.includes('|')) {
    const parts = fullName.split('|');
    pureName = parts[0].trim();
    description = parts.slice(1).map(s => s.trim()).join('. ');
  }
  const parenRegex = /\(([^)]+)\)/;
  pureName = pureName.replace(parenRegex, '').trim();
  pureName = pureName.replace(/\s+/g, ' ').trim();

  const basePrice = p.discount_price_vnd || p.actual_price_vnd || 0;
  const subCat = p.sub_category ? p.sub_category.toLowerCase() : '';
  
  let skus = [];
  const randomId = () => Math.random().toString(36).substring(2, 7).toUpperCase();

  // 2. Sinh SKU và Attribute dựa trên ngành hàng (Category)
  if (subCat.includes('diet') || subCat.includes('nutrition') || subCat.includes('supplement')) {
    // Ngành thực phẩm bổ sung: Sinh vị và khối lượng
    skus = [
      {
        sku_code: `SKU-${randomId()}-CHOC-1KG`,
        price: basePrice,
        stock: Math.floor(Math.random() * 100) + 10,
        attributes: { flavor: 'Chocolate', weight: '1 kg' }
      },
      {
        sku_code: `SKU-${randomId()}-VAN-1KG`,
        price: basePrice,
        stock: Math.floor(Math.random() * 100) + 10,
        attributes: { flavor: 'Vanilla', weight: '1 kg' }
      },
      {
        sku_code: `SKU-${randomId()}-CHOC-2KG`,
        price: Math.floor(basePrice * 1.8), // Hộp to đắt hơn
        stock: Math.floor(Math.random() * 50) + 5,
        attributes: { flavor: 'Chocolate', weight: '2 kg' }
      }
    ];
  } else if (subCat.includes('shoes') || subCat.includes('clothing') || subCat.includes('cycling') || subCat.includes('fitness')) {
    // Ngành thời trang/đồ thể thao: Sinh Size và Màu sắc
    skus = [
      {
        sku_code: `SKU-${randomId()}-BLK-M`,
        price: basePrice,
        stock: Math.floor(Math.random() * 100) + 20,
        attributes: { color: 'Black', size: 'M' }
      },
      {
        sku_code: `SKU-${randomId()}-WHT-M`,
        price: basePrice,
        stock: Math.floor(Math.random() * 100) + 20,
        attributes: { color: 'White', size: 'M' }
      },
      {
        sku_code: `SKU-${randomId()}-BLK-L`,
        price: Math.floor(basePrice * 1.05), // Size to hơn đắt hơn chút
        stock: Math.floor(Math.random() * 80) + 10,
        attributes: { color: 'Black', size: 'L' }
      }
    ];
  } else if (subCat.includes('phone') || subCat.includes('electronics')) {
    // Ngành điện tử: Sinh Dung lượng và Màu sắc
    skus = [
      {
        sku_code: `SKU-${randomId()}-BLK-128`,
        price: basePrice,
        stock: Math.floor(Math.random() * 50) + 5,
        attributes: { color: 'Black', storage: '128GB' }
      },
      {
        sku_code: `SKU-${randomId()}-SLV-128`,
        price: basePrice,
        stock: Math.floor(Math.random() * 50) + 5,
        attributes: { color: 'Silver', storage: '128GB' }
      },
      {
        sku_code: `SKU-${randomId()}-BLK-256`,
        price: Math.floor(basePrice * 1.2), // Dung lượng cao đắt hơn
        stock: Math.floor(Math.random() * 30) + 2,
        attributes: { color: 'Black', storage: '256GB' }
      }
    ];
  } else {
    // Các ngành khác: Sinh 1 SKU mặc định
    skus = [
      {
        sku_code: `SKU-${randomId()}-DEFAULT`,
        price: basePrice,
        stock: Math.floor(Math.random() * 100) + 10,
        attributes: null
      }
    ];
  }

  return {
    ...p,
    pure_name: pureName,
    name_vi: `[Hàng Nhập] ${pureName}`,
    description_vi: `Sản phẩm ${pureName} chất lượng cao, chuyên dụng cho ${p.sub_category}. ${description}`,
    description_en: `High quality ${pureName} specialized for ${p.sub_category}. ${description}`,
    skus: skus
  };
}

async function run() {
  console.log('🚀 Bắt đầu tạo mảng SKUs và Attributes đa dạng cho từng file...');
  const files = fs.readdirSync(dir);
  
  let successCount = 0;

  for (const file of files) {
    if (file.endsWith('.json') && file !== 'package.json' && file !== 'Amazon-Products.json') {
      const filePath = path.join(dir, file);
      
      try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const jsonObj = JSON.parse(data);
        
        // Cập nhật từng sản phẩm thành cấu trúc có SKUs
        const updatedObj = jsonObj.map(item => enrichProduct(item));
        
        // Ghi đè lại file JSON
        fs.writeFileSync(filePath, JSON.stringify(updatedObj, null, 2));
        console.log(`=> Đã tạo SKUs cho: ${file}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Thất bại khi xử lý ${file}:`, error);
      }
    }
  }
  
  console.log(`\n Hoàn thành! Đã cập nhật ${successCount} file JSON với cấu trúc SKUs mới.`);
}

run();
