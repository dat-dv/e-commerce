"use client";

import { useCartStore } from "@/hooks/cart/use-cart-store";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Star,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { TProduct } from "@/domain/products/types/products.model";

export interface ProductDetailProps {
  product: TProduct;
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Q86 trắng");

  const selectedSku = product.skus[selectedSkuIndex];

  // Collect all available images
  const images = [
    product.image_url,
    ...product.skus.map((sku) => sku.image_url).filter(Boolean),
  ].filter((img): img is string => typeof img === "string");

  const [selectedImage, setSelectedImage] = useState(0);

  // Use specific dummy data or real data
  const name =
    product.name ||
    "Tai nghe Bluetooth cổ điển Q86 không dây, hiệu ứng âm thanh nổi hifi, micrô tích hợp, cuộc gọi thoại độ phân giải cao";
  const price = selectedSku?.price ? Number(selectedSku.price) : 88000;
  const originalPrice = selectedSku?.original_price
    ? Number(selectedSku.original_price)
    : 150000;
  const discountPercent = selectedSku?.discount_percent || 41;

  const handleAddToCart = () => {
    if (!selectedSku) return;

    addItem(
      {
        id: selectedSku.id,
        product_id: product.id,
        sku_id: selectedSku.id,
        name: name,
        price: price,
        image_url: images[selectedImage] || product.image_url || "",
        attributes: `Màu: ${selectedColor}`,
      },
      quantity,
    );
  };

  // Dummy data for reviews
  const reviews = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      rating: 5,
      date: "2 ngày trước",
      content: "Sản phẩm cực kỳ tốt, đóng gói cẩn thận. Rất đáng tiền!",
      likes: 12,
    },
    {
      id: 2,
      user: "Trần Thị B",
      rating: 4,
      date: "1 tuần trước",
      content:
        "Chất lượng ổn, giao hàng hơi lâu một xíu nhưng shipper thân thiện.",
      likes: 4,
    },
    {
      id: 3,
      user: "Lê Văn C",
      rating: 5,
      date: "2 tuần trước",
      content: "Đẹp tuyệt vời, đúng như mô tả. Sẽ ủng hộ shop dài dài.",
      likes: 8,
    },
  ];

  // Dummy data for similar products
  const dummyProducts = [
    {
      id: "1",
      name: "Sản phẩm tương tự 1",
      price: 1500000,
      image_url:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format",
    },
    {
      id: "2",
      name: "Sản phẩm tương tự 2",
      price: 2100000,
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format",
    },
    {
      id: "3",
      name: "Sản phẩm tương tự 3",
      price: 990000,
      image_url:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format",
    },
    {
      id: "4",
      name: "Sản phẩm tương tự 4",
      price: 3200000,
      image_url:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
      {/* SECTION 1: TOP GRID (Image & Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface border border-content/[0.05] rounded-3xl p-6 shadow-sm">
        {/* Left Column: Images (Span 5) - Reduced size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 space-y-4"
        >
          {/* Main Image */}
          <div className="relative aspect-square bg-content/[0.02] border border-content/[0.05] rounded-2xl overflow-hidden flex items-center justify-center">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
            >
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-content/30 text-sm">
                  No Image
                </div>
              )}
            </motion.div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    index === selectedImage
                      ? "border-primary"
                      : "border-transparent hover:border-content/10"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column: Info (Span 7) - Increased size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 flex flex-col gap-5"
        >
          {/* Product Title */}
          <h1 className="text-xl font-semibold text-content leading-snug">
            {name}
          </h1>

          {/* Rating, Reviews, Sold & Report */}
          <div className="flex items-center justify-between text-sm border-b border-content/[0.05] pb-4">
            <div className="flex items-center gap-4 divide-x divide-content/[0.1]">
              <div className="flex items-center gap-1">
                <span className="font-bold text-primary text-base">4.7</span>
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <div className="pl-4 flex items-center gap-1">
                <span className="font-bold text-content">250</span>
                <span className="text-content/50 text-xs">Đánh giá</span>
              </div>
              <div className="pl-4 flex items-center gap-1">
                <span className="font-bold text-content">100k+</span>
                <span className="text-content/50 text-xs">Đã bán</span>
              </div>
            </div>
            <button className="text-content/40 hover:text-content text-xs font-medium transition-colors">
              Tố cáo
            </button>
          </div>

          {/* Price Box - Shopee Style */}
          <div className="bg-content/[0.02] p-4 rounded-xl flex items-center gap-4">
            <span className="text-content/40 line-through text-base">
              {originalPrice.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-3xl font-bold text-primary">
              {price.toLocaleString("vi-VN")}₫
            </span>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-lg">
              -{discountPercent}%
            </span>
          </div>

          {/* Color Options */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-content/60 w-24">
              Màu sắc
            </span>
            <div className="flex flex-wrap gap-2">
              {["Q86 trắng", "Q86 nâu"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedColor === color
                      ? "border-primary text-primary bg-primary/5"
                      : "border-content/[0.1] hover:border-content/20 text-content/80"
                  }`}
                >
                  {color}
                  {selectedColor === color && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Stock */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-content/60 w-24">
              Số lượng
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-content/[0.1] rounded-lg overflow-hidden h-9">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 hover:bg-content/[0.05] transition-colors border-r border-content/[0.1]"
                >
                  <Minus size={12} />
                </button>
                <span className="px-4 font-semibold text-sm min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 hover:bg-content/[0.05] transition-colors border-l border-content/[0.1]"
                >
                  <Plus size={12} />
                </button>
              </div>
              <span className="text-sm text-content/50">
                5548 sản phẩm có sẵn
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3.5 rounded-xl font-semibold transition-colors border border-primary/20"
            >
              <ShoppingCart size={18} />
              Thêm vào giỏ hàng
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/10"
            >
              Mua ngay
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* SECTION 2: BRAND INFO */}
      <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-content/[0.05] flex items-center justify-center text-lg font-bold text-content/40">
            Logo
          </div>
          <div>
            <h3 className="font-bold text-content">Thương hiệu</h3>
            <p className="text-xs text-content/50">
              Các sản phẩm chính hãng từ thương hiệu này
            </p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl border border-content/[0.05] text-sm font-semibold hover:bg-content/[0.03] transition-colors">
          Xem shop
        </button>
      </div>

      {/* SECTION 3: DESCRIPTION & CATEGORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-content mb-4">
              Mô tả sản phẩm
            </h2>
            <div className="text-content/70 text-sm leading-relaxed space-y-4">
              <p>
                Đây là phần mô tả chi tiết cho sản phẩm. Hiện tại dữ liệu đang
                được cập nhật. Sản phẩm mang lại trải nghiệm tuyệt vời với thiết
                kế hiện đại và chất liệu cao cấp.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Thiết kế tinh tế, sang trọng.</li>
                <li>Chất lượng hoàn thiện cao cấp.</li>
                <li>Bảo hành chính hãng 12 tháng.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-content mb-4">Danh mục</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-content/[0.03] text-content/70 text-xs font-bold rounded-lg border border-content/[0.05]">
                {product.category || "Chưa phân loại"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: REVIEWS & RATINGS */}
      <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-baseline">
          <div>
            <h2 className="text-lg font-bold text-content">
              Đánh giá từ khách hàng
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-bold text-content">4.8 / 5</span>
              <span className="text-sm text-content/50">(256 đánh giá)</span>
            </div>
          </div>

          {/* Review Filters */}
          <div className="flex flex-wrap gap-2">
            {["Tất cả", "5 Sao", "4 Sao", "Có hình ảnh"].map(
              (filter, index) => (
                <button
                  key={index}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    index === 0
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-content/[0.05] hover:border-content/[0.1] text-content/60"
                  }`}
                >
                  {filter}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Review List */}
        <div className="divide-y divide-content/[0.05]">
          {reviews.map((review) => (
            <div key={review.id} className="py-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-content text-sm">
                    {review.user}
                  </span>
                  <div className="flex text-amber-400 mt-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-content/30">{review.date}</span>
              </div>
              <p className="text-sm text-content/70">{review.content}</p>
              <button className="flex items-center gap-1.5 text-xs text-content/40 hover:text-content transition-colors w-fit">
                <ThumbsUp size={12} />
                <span>Hữu ích ({review.likes})</span>
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 pt-2">
          <button className="p-1.5 rounded-lg border border-content/[0.05] opacity-50 cursor-not-allowed">
            <ChevronLeft size={14} />
          </button>
          <button className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs">
            1
          </button>
          <button className="w-7 h-7 rounded-lg border border-content/[0.05] text-xs hover:bg-content/[0.03]">
            2
          </button>
          <button className="p-1.5 rounded-lg border border-content/[0.05] hover:bg-content/[0.03]">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* SECTION 5: SIMILAR PRODUCTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-content">
            Sản phẩm cùng danh mục
          </h2>
          <button className="text-sm font-semibold text-primary hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dummyProducts.map((p) => (
            <div
              key={p.id}
              className="group cursor-pointer bg-surface border border-content/[0.05] rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-content/[0.02] mb-3">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-sm text-content line-clamp-1">
                {p.name}
              </h3>
              <p className="text-sm font-black text-primary mt-1">
                {p.price.toLocaleString("vi-VN")} đ
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: RECOMMENDATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-content">Gợi ý cho bạn</h2>
          <button className="text-sm font-semibold text-primary hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dummyProducts.reverse().map((p) => (
            <div
              key={p.id}
              className="group cursor-pointer bg-surface border border-content/[0.05] rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-content/[0.02] mb-3">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-sm text-content line-clamp-1">
                {p.name}
              </h3>
              <p className="text-sm font-black text-primary mt-1">
                {p.price.toLocaleString("vi-VN")} đ
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
