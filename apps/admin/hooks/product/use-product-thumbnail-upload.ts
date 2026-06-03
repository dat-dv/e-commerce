"use client";

import { toast } from "@ecommerce/ui";
import { useCallback, useState } from "react";

import { adminUploadUseCase } from "@/domain/upload";

interface IUploadedThumbnail {
  id: string;
  url: string;
}

interface IUseProductThumbnailUploadParams {
  onUploaded: (thumbnail: IUploadedThumbnail) => void;
}

export const useProductThumbnailUpload = ({
  onUploaded,
}: IUseProductThumbnailUploadParams) => {
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const uploadThumbnail = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Select a valid image file.");
        return;
      }

      setIsUploadingThumbnail(true);
      try {
        const response = await adminUploadUseCase.uploadImage.execute(file);
        if (response.status === "success" && response.data) {
          onUploaded({
            id: response.data.id,
            url: response.data.url,
          });
          toast.success("Thumbnail uploaded. Save product to apply it.");
        } else {
          toast.error(response.message || "Failed to upload thumbnail.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload thumbnail.");
      } finally {
        setIsUploadingThumbnail(false);
      }
    },
    [onUploaded],
  );

  return {
    isUploadingThumbnail,
    uploadThumbnail,
  };
};
