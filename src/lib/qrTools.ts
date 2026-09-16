import QRCode from 'qrcode';

export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';

/** Renders a QR code for the given text onto a canvas and returns it as a PNG blob. */
export async function generateQrCodePng(
  text: string,
  options: { size?: number; errorCorrection?: QrErrorCorrection } = {},
): Promise<Blob> {
  if (!text.trim()) throw new Error('Enter some text or a URL to encode.');
  const { size = 320, errorCorrection = 'M' } = options;

  const canvas = document.createElement('canvas');
  try {
    await QRCode.toCanvas(canvas, text, {
      width: size,
      errorCorrectionLevel: errorCorrection,
      margin: 2,
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Could not generate a QR code for that text.');
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('QR code export failed'))), 'image/png');
  });
}
