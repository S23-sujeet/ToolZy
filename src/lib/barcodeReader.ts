import { BrowserMultiFormatReader } from '@zxing/browser';

export async function readBarcode(file: File): Promise<{ text: string; format: string }> {
  const imageUrl = URL.createObjectURL(file);
  const reader = new BrowserMultiFormatReader();
  try {
    const result = await reader.decodeFromImageUrl(imageUrl);
    return { text: result.getText(), format: result.getBarcodeFormat().toString() };
  } catch {
    throw new Error('No barcode was found. Try a sharper image with the barcode fully visible.');
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}