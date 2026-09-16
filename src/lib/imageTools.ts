export type ImageOutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export interface ImageResizeOptions {
  width: number;
  height: number;
  format: ImageOutputFormat;
  quality: number;
}

export async function resizeImage(file: File, options: ImageResizeOptions): Promise<{ blob: Blob; width: number; height: number }> {
  if (!Number.isInteger(options.width) || !Number.isInteger(options.height) || options.width < 1 || options.height < 1) {
    throw new Error('Enter valid pixel dimensions.');
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;
  try {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not prepare the image.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    if (options.format !== 'image/png') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Image export failed.'))),
        options.format,
        options.quality,
      );
    });
    return { blob, width: canvas.width, height: canvas.height };
  } finally {
    bitmap.close();
  }
}

export async function convertImage(file: File, format: ImageOutputFormat, quality = 0.9): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    return (await resizeImage(file, { width: bitmap.width, height: bitmap.height, format, quality })).blob;
  } finally {
    bitmap.close();
  }
}