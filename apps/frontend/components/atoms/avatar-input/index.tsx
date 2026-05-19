"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

import Avatar from "@/components/atoms/avatar";
import ImgCropper from "@/components/molecules/img-cropper";

export interface AvatarInputProps {
  value?: string;
  onChange: (value: string) => void;
  displayName?: string;
  size?: number;
  disabled?: boolean;
}

const AvatarInput: React.FC<AvatarInputProps> = ({
  value,
  onChange,
  displayName,
  size = 160,
  disabled = false,
}) => {
  const t = useTranslations("Common.avatarInput");
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setShowCropper(true);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (blob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setShowCropper(false);
      setSelectedImage(null);
    };
    reader.readAsDataURL(blob);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div
        className="relative group/avatar"
        style={{ width: size, height: size }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover/avatar:bg-primary/30 transition-all duration-500" />

        {/* Avatar ring */}
        <div className="relative rounded-full border-4 border-surface shadow-2xl overflow-hidden shadow-primary/20 transform group-hover/avatar:scale-105 transition-all duration-500 w-full h-full">
          <Avatar url={value} name={displayName} size={size} />
        </div>

        {/* Camera overlay */}
        {!disabled && (
          <>
            <button
              type="button"
              className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center gap-1 cursor-pointer z-10 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"
              onClick={() => fileRef.current?.click()}
              aria-label={t("changeAvatar")}
            >
              <Camera className="w-7 h-7 text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                {t("change")}
              </span>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      <AnimatePresence>
        {showCropper && selectedImage && (
          <ImgCropper
            image={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCancelCrop}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AvatarInput;
