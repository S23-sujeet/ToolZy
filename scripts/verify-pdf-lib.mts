import { PDFDocument } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  mergePdfs,
  splitPdf,
  extractPageRange,
  deletePages,
  rotatePdf,
  addWatermark,
  addPageNumbers,
  imagesToPdf,
  compressPdf,
  getPageCount,
} from '../src/lib/pdfUtils.ts';

const assetDir = path.join(os.tmpdir(), 'pdf-toolkit-test-assets');
const load = (name: string) => readFileSync(path.join(assetDir, name));

const results: { name: string; pass: boolean; detail: string }[] = [];

function record(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${name}: ${detail}`);
}

async function run() {
  const onePage = load('sample-1page.pdf');
  const twoPage = load('sample-2page.pdf');
  const fivePage = load('sample-5page.pdf');
  const redPng = load('red.png');
  const whiteJpg = load('white.jpg');

  // 1. Merge
  try {
    const merged = await mergePdfs([onePage, twoPage, fivePage]);
    const count = await getPageCount(merged);
    record('mergePdfs', count === 8, `expected 8 pages, got ${count}`);
  } catch (e) {
    record('mergePdfs', false, String(e));
  }

  // 2. Split (each page)
  try {
    const parts = await splitPdf(fivePage, 'sample-5page');
    const allSinglePage = (
      await Promise.all(parts.map(async ([, bytes]) => (await getPageCount(bytes)) === 1))
    ).every(Boolean);
    record(
      'splitPdf',
      parts.length === 5 && allSinglePage,
      `expected 5 single-page parts, got ${parts.length} parts, allSinglePage=${allSinglePage}`,
    );
  } catch (e) {
    record('splitPdf', false, String(e));
  }

  // 3. Extract page range
  try {
    const extracted = await extractPageRange(fivePage, 2, 4);
    const count = await getPageCount(extracted);
    record('extractPageRange(2,4)', count === 3, `expected 3 pages, got ${count}`);
  } catch (e) {
    record('extractPageRange', false, String(e));
  }

  // 4. Delete pages
  try {
    const edited = await deletePages(fivePage, [2, 4]);
    const count = await getPageCount(edited);
    record('deletePages([2,4])', count === 3, `expected 3 pages remaining, got ${count}`);
  } catch (e) {
    record('deletePages', false, String(e));
  }

  // 5. Rotate
  try {
    const rotated = await rotatePdf(twoPage, 90);
    const doc = await PDFDocument.load(rotated);
    const angles = doc.getPages().map((p) => p.getRotation().angle);
    record('rotatePdf(90)', angles.every((a) => a === 90), `angles=${angles.join(',')}`);
  } catch (e) {
    record('rotatePdf', false, String(e));
  }

  // 6. Watermark
  try {
    const watermarked = await addWatermark(onePage, { text: 'CONFIDENTIAL' });
    const count = await getPageCount(watermarked);
    record('addWatermark', count === 1 && watermarked.byteLength > onePage.byteLength, `count=${count}, size=${watermarked.byteLength} vs original ${onePage.byteLength}`);
  } catch (e) {
    record('addWatermark', false, String(e));
  }

  // 7. Page numbers
  try {
    const numbered = await addPageNumbers(fivePage);
    const count = await getPageCount(numbered);
    record('addPageNumbers', count === 5, `expected 5 pages, got ${count}`);
  } catch (e) {
    record('addPageNumbers', false, String(e));
  }

  // 8. Images to PDF
  try {
    const pngFile = new File([redPng], 'red.png', { type: 'image/png' });
    const jpgFile = new File([whiteJpg], 'white.jpg', { type: 'image/jpeg' });
    const pdfFromImages = await imagesToPdf([pngFile, jpgFile]);
    const count = await getPageCount(pdfFromImages);
    record('imagesToPdf', count === 2, `expected 2 pages (1 per image), got ${count}`);
  } catch (e) {
    record('imagesToPdf', false, String(e));
  }

  // 9. Compress
  try {
    const compressed = await compressPdf(fivePage, 'medium');
    const count = await getPageCount(compressed);
    record('compressPdf', count === 5, `page count preserved: ${count}, size ${fivePage.byteLength} -> ${compressed.byteLength}`);
  } catch (e) {
    record('compressPdf', false, String(e));
  }

  // 10. Edge case: delete all pages should still work but produce a 0-page/empty doc consumer prevents in UI;
  // verify the lib doesn't crash on deleting a subset covering all-but-one.
  try {
    const edited = await deletePages(onePage, []);
    const count = await getPageCount(edited);
    record('deletePages([]) no-op', count === 1, `expected unchanged 1 page, got ${count}`);
  } catch (e) {
    record('deletePages([]) no-op', false, String(e));
  }

  const outSummary = path.join(assetDir, 'node-test-results.json');
  writeFileSync(outSummary, JSON.stringify(results, null, 2));

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed.`);
  if (failed.length > 0) process.exitCode = 1;
}

run();
