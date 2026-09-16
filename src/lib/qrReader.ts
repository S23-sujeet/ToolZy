import jsQR from 'jsqr';

export async function readQrCode(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  try {
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Your browser could not prepare the image for scanning.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const result = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, {
      inversionAttempts: 'attemptBoth',
    });
    if (!result) throw new Error('No QR code was found. Try a sharper, better-lit image.');
    return result.data;
  } finally {
    bitmap.close();
  }
}