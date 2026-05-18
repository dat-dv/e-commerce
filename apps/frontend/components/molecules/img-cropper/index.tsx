"use client";

import { MaximizeIcon, XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import {
  AriaDialog,
  AriaDialogPanel,
  AriaDialogTitle,
} from "@/components/atoms/aria/dialog";
import Button from "@/components/atoms/button";

import getCroppedImg from "./get-cropped-img";

interface ImgCropperProps {
  image: string;
  onCropComplete: (blob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  saveLabel?: string;
  title?: string;
}

const ImgCropper: React.FC<ImgCropperProps> = ({
  image,
  onCropComplete,
  onCancel,
  aspect = 1,
  saveLabel = "Save changes",
  title: _title = "Edit photo",
}) => {
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
      // Not in a request context, skip cookie forwarding
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <AriaDialog isOpen={true} onClose={onCancel} className="relative z-[100]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <AriaDialogPanel className="relative w-full max-w-sm max-h-[90vh] overflow-hidden bg-surface border border-content/10 rounded-3xl shadow-2xl flex flex-col">
          {/* Close Button Overlay */}
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 z-10 size-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>

          {/* Cropper Area */}
          <div className="relative w-full aspect-square bg-neutral-900 overflow-hidden flex-shrink-0">
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
          <div className="p-6 space-y-6 overflow-y-auto">
            <AriaDialogTitle className="text-lg font-bold text-content sr-only">
              Edit Photo
            </AriaDialogTitle>

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
                className="flex-1 h-1 bg-content/10 rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={onCancel}
                className="flex-1 rounded-xl h-11 text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCrop}
                loading={isCropping}
                className="flex-1 rounded-xl h-11 text-sm font-semibold"
              >
                {saveLabel}
              </Button>
            </div>
          </div>
        </AriaDialogPanel>
      </div>
    </AriaDialog>
  );
};

export default ImgCropper;
