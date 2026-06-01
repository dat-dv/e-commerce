import { ImageUp, Package } from "lucide-react";
import type { ChangeEvent } from "react";

interface IProductThumbnailFieldProps {
  thumbnailUrl?: string;
  defaultName: string;
  isEditing: boolean;
  isUploadingThumbnail: boolean;
  onThumbnailUpload?: (file: File) => void;
}

export const ProductThumbnailField = ({
  thumbnailUrl,
  defaultName,
  isEditing,
  isUploadingThumbnail,
  onThumbnailUpload,
}: IProductThumbnailFieldProps) => {
  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onThumbnailUpload?.(file);
    }
    event.target.value = "";
  };

  return (
    <div className="bg-content/[0.02] flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] p-4">
      <div className="bg-content/[0.02] flex h-36 w-36 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color)]">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={defaultName}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-16 w-16 text-[var(--muted)]" />
        )}
      </div>
      <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
        Thumbnail Image
      </p>
      {isEditing && (
        <label className="hover:border-primary mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-xs font-semibold text-[var(--app-text)] transition-colors disabled:cursor-not-allowed disabled:opacity-60">
          <ImageUp className="h-4 w-4" />
          {isUploadingThumbnail ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isUploadingThumbnail}
            onChange={handleThumbnailChange}
          />
        </label>
      )}
    </div>
  );
};
