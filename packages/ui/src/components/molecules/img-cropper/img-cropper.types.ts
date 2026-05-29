export interface IImgCropperProps {
  image: string;
  onCropComplete: (blob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  title?: string;
  saveLabel?: string;
  cancelLabel?: string;
  closeLabel?: string;
}
