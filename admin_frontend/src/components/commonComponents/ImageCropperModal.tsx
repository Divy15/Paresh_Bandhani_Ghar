import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  onClose: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  onCropComplete,
  onClose,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteCallback = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to crop image using HTML Canvas
  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to the cropped area size
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert Canvas to a File Object blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], 'cropped_thumb.jpg', { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete(croppedFile, previewUrl);
      }, 'image/jpeg');
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full overflow-hidden shadow-xl flex flex-col border border-neutral-200 dark:border-neutral-800">
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">Adjust Thumbnail Circular View</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-80 bg-neutral-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // Square aspect ratio to match the circle
            cropShape="round" // Creates the circular grid overlay visual
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-neutral-400" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-maroon-500"
            />
            <ZoomIn className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={createCroppedImage}
              className="px-5 py-2 bg-brand-maroon-500 hover:bg-brand-maroon-600 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};