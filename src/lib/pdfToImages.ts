import * as pdfjsLib from 'pdfjs-dist';
// Vite-friendly worker URL: bundles the worker as its own asset.
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export type ImageFormat = 'png' | 'jpeg';

export interface PdfPageImage {
  pageNumber: number;
  blob: Blob;
  fileName: string;
}

/** Renders every page of a PDF to a raster image at the given scale/quality. */
export async function pdfToImages(
  file: File | ArrayBuffer,
  options: { format?: ImageFormat; scale?: number; quality?: number; baseName?: string } = {},
): Promise<PdfPageImage[]> {
  const { format = 'png', scale = 2, quality = 0.92, baseName = 'page' } = options;
  const data = file instanceof File ? await file.arrayBuffer() : file;
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
  const pdf = await loadingTask.promise;
  const images: PdfPageImage[] = [];
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const digits = String(pdf.numPages).length;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create canvas rendering context');

    await page.render({ canvasContext: context, viewport, canvas }).promise;

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), mimeType, quality);
    });

    const label = String(pageNumber).padStart(digits, '0');
    images.push({
      pageNumber,
      blob,
      fileName: `${baseName}-${label}.${format === 'png' ? 'png' : 'jpg'}`,
    });
  }

  return images;
}
