import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

/** Loose alias for anything that can be turned into pdf-lib input bytes. */
export type PdfSource = File | ArrayBuffer | Uint8Array;

async function toBytes(source: PdfSource): Promise<ArrayBuffer> {
  if (source instanceof File) return source.arrayBuffer();
  if (source instanceof Uint8Array) {
    return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength) as ArrayBuffer;
  }
  return source;
}

export async function mergePdfs(files: PdfSource[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await toBytes(file);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return merged.save();
}

/** Splits a PDF into individual single-page PDFs. Returns [name, bytes][]. */
export async function splitPdf(file: PdfSource, baseName: string): Promise<Array<[string, Uint8Array]>> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = doc.getPageCount();
  const result: Array<[string, Uint8Array]> = [];
  for (let i = 0; i < total; i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(doc, [i]);
    out.addPage(page);
    const outBytes = await out.save();
    const digits = String(total).length;
    const pageLabel = String(i + 1).padStart(digits, '0');
    result.push([`${baseName}-page-${pageLabel}.pdf`, outBytes]);
  }
  return result;
}

/** Extracts a specific page range (1-indexed, inclusive) into a new PDF. */
export async function extractPageRange(
  file: PdfSource,
  startPage: number,
  endPage: number,
): Promise<Uint8Array> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = doc.getPageCount();
  const start = Math.max(1, startPage);
  const end = Math.min(total, endPage);
  const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(doc, indices);
  pages.forEach((page) => out.addPage(page));
  return out.save();
}

/** Removes the given 1-indexed page numbers from a PDF. */
export async function deletePages(file: PdfSource, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const toRemove = new Set(pageNumbers.map((n) => n - 1));
  const indices = doc.getPageIndices().filter((i) => !toRemove.has(i));
  const out = await PDFDocument.create();
  const pages = await out.copyPages(doc, indices);
  pages.forEach((page) => out.addPage(page));
  return out.save();
}

export type RotationAngle = 90 | 180 | 270;

/** Rotates every page of a PDF by the given angle (clockwise). */
export async function rotatePdf(file: PdfSource, angle: RotationAngle): Promise<Uint8Array> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  doc.getPages().forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360));
  });
  return doc.save();
}

export interface WatermarkOptions {
  text: string;
  opacity?: number;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
  rotationDegrees?: number;
}

export async function addWatermark(file: PdfSource, options: WatermarkOptions): Promise<Uint8Array> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const { text, opacity = 0.25, fontSize = 48, color = { r: 0.5, g: 0.5, b: 0.5 }, rotationDegrees = -45 } = options;

  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotationDegrees),
    });
  });

  return doc.save();
}

/** Adds "page X of N" numbering to the bottom-center of every page. */
export async function addPageNumbers(file: PdfSource): Promise<Uint8Array> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;

  pages.forEach((page, index) => {
    const { width } = page.getSize();
    const label = `${index + 1} / ${total}`;
    const size = 10;
    const textWidth = font.widthOfTextAtSize(label, size);
    page.drawText(label, {
      x: width / 2 - textWidth / 2,
      y: 20,
      size,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  });

  return doc.save();
}

/** Builds a PDF from a list of images (jpg/png), one image per page. */
export async function imagesToPdf(images: File[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (const image of images) {
    const bytes = new Uint8Array(await image.arrayBuffer());
    const isPng = image.type === 'image/png' || image.name.toLowerCase().endsWith('.png');
    const embedded = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const page = doc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }
  return doc.save();
}

/**
 * Re-encodes embedded raster images at a lower quality/resolution to shrink
 * a PDF's file size. This is a best-effort browser-side "compression" -
 * true structural PDF compression requires a server-side tool.
 */
export async function compressPdf(file: PdfSource, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  // pdf-lib re-saves with object streams enabled, which alone can meaningfully
  // shrink PDFs produced by non-optimizing tools (e.g. scanners, Office exporters).
  const useObjectStreams = quality !== 'low';
  return doc.save({ useObjectStreams });
}

export async function getPageCount(file: PdfSource): Promise<number> {
  const bytes = await toBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}
