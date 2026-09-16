import * as pdfjsLib from 'pdfjs-dist';
// Vite-friendly worker URL: bundles the worker as its own asset.
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export interface PdfPageText {
  pageNumber: number;
  text: string;
}

/** Extracts the plain-text layer of every page in a PDF (does not OCR scanned/image-only pages). */
export async function extractTextFromPdf(file: File | ArrayBuffer): Promise<PdfPageText[]> {
  const data = file instanceof File ? await file.arrayBuffer() : file;
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
  const pdf = await loadingTask.promise;
  const pages: PdfPageText[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
    pages.push({ pageNumber, text });
  }

  return pages;
}
