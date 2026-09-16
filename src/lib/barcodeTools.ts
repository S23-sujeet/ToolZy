import bwipjs from 'bwip-js';

export type BarcodeFormat = 'code128' | 'ean13' | 'upca';

const BARCODE_OPTIONS: Record<BarcodeFormat, string> = {
  code128: 'code128',
  ean13: 'ean13',
  upca: 'upca',
};

export async function generateBarcodePng(text: string, format: BarcodeFormat): Promise<Blob> {
  const value = text.trim();
  if (!value) throw new Error('Enter text or numbers to create a barcode.');

  const canvas = document.createElement('canvas');
  try {
    await bwipjs.toCanvas(canvas, {
      bcid: BARCODE_OPTIONS[format],
      text: value,
      scale: 3,
      height: 12,
      includetext: true,
      textxalign: 'center',
      backgroundcolor: 'FFFFFF',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not create a barcode for that value.');
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Barcode export failed.'))), 'image/png');
  });
}