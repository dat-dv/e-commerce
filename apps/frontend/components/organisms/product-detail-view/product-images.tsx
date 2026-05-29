"use client";

import { ImagePreview } from "@ecommerce/ui";
import { motion } from "framer-motion";
import Image from "next/image";

import { useTranslations } from "next-intl";

interface ProductImagesProps {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  name: string;
}

export const ProductImages = ({
  images,
  selectedImage,
  setSelectedImage,
  name,
}: ProductImagesProps) => {
  const t = useTranslations("ProductDetailPage");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 lg:col-span-4"
    >
      {/* Main Image */}
      <div className="bg-content/[0.02] border-content/[0.05] relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative h-full w-full"
        >
          {images[selectedImage] ? (
            <ImagePreview
              src={images[selectedImage]}
              alt={name}
              imageComponent={Image}
              triggerClassName="absolute inset-0 rounded-2xl"
              imageProps={{
                fill: true,
                sizes: "(max-width: 1024px) 100vw, 40vw",
                className: "object-contain",
              }}
            />
          ) : (
            <div className="text-content/30 flex h-full items-center justify-center text-sm">
              {t("noImage")}
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
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                index === selectedImage
                  ? "border-primary"
                  : "hover:border-content/10 border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
