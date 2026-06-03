"use client";

import { toast } from "@ecommerce/ui";
import { useCallback, useTransition } from "react";

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
  const [isUploadingThumbnail, startUploadTransition] = useTransition();

  const uploadThumbnail = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Select a valid image file.");
        return;
      }

      startUploadTransition(async () => {
        try {
          const response = await adminUploadUseCase.uploadImage.execute(file);
          onUploaded({
            id: response.id,
            url: response.url,
          });
          toast.success("Thumbnail uploaded. Save product to apply it.");
        } catch {
          toast.error("Failed to upload thumbnail.");
        }
      });
    },
    [onUploaded],
  );

  return {
    isUploadingThumbnail,
    uploadThumbnail,
  };
};
