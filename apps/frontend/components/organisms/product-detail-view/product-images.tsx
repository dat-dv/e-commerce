"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-4 space-y-4"
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
              className="object-contain"
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
  );
};
