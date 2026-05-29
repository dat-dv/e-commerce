"use client";

import { MaximizeIcon, XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import Button from "../../atoms/button";
import { AppDialog, AppDialogPanel, AppDialogTitle } from "../../atoms/dialog";
import getCroppedImg from "./get-cropped-img";
import { IImgCropperProps } from "./img-cropper.types";

export const ImgCropper = ({
  image,
  onCropComplete,
  onCancel,
  aspect = 1,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  closeLabel = "Close",
  title = "Crop Image",
}: IImgCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropChangeComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsCropping(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch {
      // ignore
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <AppDialog isOpen={true} onClose={onCancel}>
      <AppDialogPanel className="bg-surface border-content/10 relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl border shadow-2xl">
        {/* Close Button Overlay */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/40"
          aria-label={closeLabel}
        >
          <XIcon size={16} />
        </button>

        {/* Cropper Area */}
        <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden bg-neutral-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            minZoom={0.1}
            maxZoom={10}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropChangeComplete}
            onZoomChange={onZoomChange}
            restrictPosition={false}
            classes={{
              containerClassName: "cursor-move",
              mediaClassName: "transition-transform duration-300 ease-out",
              cropAreaClassName:
                "border-2 border-primary rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]",
            }}
            showGrid={false}
          />
        </div>

        {/* Controls */}
        <div className="space-y-6 overflow-y-auto p-6">
          <AppDialogTitle className="text-content sr-only text-lg font-bold">
            {title}
          </AppDialogTitle>

          {/* Zoom Control */}
          <div className="flex items-center gap-4">
            <MaximizeIcon size={16} className="text-content/40 shrink-0" />
            <input
              type="range"
              value={zoom}
              min={0.1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="bg-content/10 accent-primary h-1 flex-1 cursor-pointer appearance-none rounded-full"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="h-11 flex-1 rounded-xl text-sm font-semibold"
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              onClick={handleCrop}
              loading={isCropping}
              className="h-11 flex-1 rounded-xl text-sm font-semibold"
            >
              {saveLabel}
            </Button>
          </div>
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
};

ImgCropper.displayName = "ImgCropper";

export default ImgCropper;
