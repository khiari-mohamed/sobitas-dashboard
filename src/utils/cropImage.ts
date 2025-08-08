// src/utils/cropImage.ts
// Enhanced utility for react-easy-crop with zoom and rotation support

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function getCroppedImg(
  imageSrc: string | Blob,
  pixelCrop: CropArea,
  rotation = 0
): Promise<Blob> {
  const image: HTMLImageElement = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  const radians = (rotation * Math.PI) / 180;

  // Calculate rotated image bounding box size
  const safeArea = Math.max(image.width, image.height) * 2;

  canvas.width = safeArea;
  canvas.height = safeArea;

  // Move the origin to the center of the canvas
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(radians);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // Set canvas to final size and paste cropped data
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('Canvas is empty'));
      else resolve(blob);
    }, 'image/jpeg');
  });
}

// Helper: convert Blob or base64 string into an HTMLImageElement
function createImage(imageSrc: string | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));

    if (typeof imageSrc === 'string') {
      image.src = imageSrc;
    } else {
      image.src = URL.createObjectURL(imageSrc);
    }
  });
}
