import * as pdfjsLib from 'pdfjs-dist';
// Vite-friendly worker URL: bundles the worker as its own asset.
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export interface ExtractedPdfImage {
  pageNumber: number;
  index: number;
  blob: Blob;
  fileName: string;
  width: number;
  height: number;
}

interface DecodedImage {
  data?: Uint8ClampedArray | Uint8Array;
  bitmap?: ImageBitmap;
  width: number;
  height: number;
  kind?: number;
}

function toImageData(img: DecodedImage): ImageData {
  const { width, height, kind } = img;
  const data = img.data;
  if (!data) throw new Error('No pixel data available for this image.');
  const rgba = new Uint8ClampedArray(width * height * 4);
  const ImageKind = pdfjsLib.ImageKind;

  if (kind === ImageKind.RGBA_32BPP) {
    rgba.set(data.subarray(0, rgba.length));
  } else if (kind === ImageKind.RGB_24BPP) {
    for (let i = 0, j = 0; j < rgba.length; i += 3, j += 4) {
      rgba[j] = data[i];
      rgba[j + 1] = data[i + 1];
      rgba[j + 2] = data[i + 2];
      rgba[j + 3] = 255;
    }
  } else if (kind === ImageKind.GRAYSCALE_1BPP) {
    for (let p = 0; p < width * height; p++) {
      const byte = data[p >> 3];
      const bit = (byte >> (7 - (p % 8))) & 1;
      const v = bit ? 255 : 0;
      rgba[p * 4] = v;
      rgba[p * 4 + 1] = v;
      rgba[p * 4 + 2] = v;
      rgba[p * 4 + 3] = 255;
    }
  } else {
    throw new Error('Unsupported embedded image color format.');
  }
  return new ImageData(rgba, width, height);
}

/**
 * Best-effort extraction of embedded raster images (not full-page renders) from a PDF,
 * using pdfjs-dist's operator list + internal page objects store. Images that fail to
 * decode are skipped individually rather than failing the whole extraction.
 */
export async function extractImagesFromPdf(file: File | ArrayBuffer): Promise<ExtractedPdfImage[]> {
  const data = file instanceof File ? await file.arrayBuffer() : file;
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
  const pdf = await loadingTask.promise;
  const results: ExtractedPdfImage[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const opList = await page.getOperatorList();
    const pageObjs = (page as unknown as { objs: { get: (id: string, cb: (v: unknown) => void) => void } }).objs;
    let index = 0;

    for (let i = 0; i < opList.fnArray.length; i++) {
      const fn = opList.fnArray[i];
      if (fn !== pdfjsLib.OPS.paintImageXObject) continue;
      const objId = opList.argsArray[i][0] as string;

      try {
        const img = await new Promise<DecodedImage | null>((resolve) => {
          pageObjs.get(objId, (value) => resolve(value as DecodedImage | null));
        });
        if (!img?.width || !img.height) continue;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        if (img.bitmap) {
          // Modern pdfjs-dist decodes images as an ImageBitmap - draw it directly.
          ctx.drawImage(img.bitmap, 0, 0);
        } else if (img.data) {
          ctx.putImageData(toImageData(img), 0, 0);
        } else {
          continue;
        }

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Image export failed'))), 'image/png');
        });

        index++;
        results.push({
          pageNumber,
          index,
          blob,
          fileName: `page-${pageNumber}-image-${index}.png`,
          width: img.width,
          height: img.height,
        });
      } catch (err) {
        console.warn(`Skipping an image on page ${pageNumber} that could not be decoded`, err);
      }
    }
  }

  if (results.length === 0) {
    throw new Error('No extractable embedded images were found in this PDF.');
  }
  return results;
}
