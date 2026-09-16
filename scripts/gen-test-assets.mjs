import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const outDir = path.join(os.tmpdir(), 'pdf-toolkit-test-assets');
mkdirSync(outDir, { recursive: true });

async function makePdf(pageCount, name) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([400, 500]);
    page.drawText(`Test page ${i} of ${pageCount}`, { x: 40, y: 450, size: 20, font, color: rgb(0, 0, 0) });
    page.drawText(`Document: ${name}`, { x: 40, y: 400, size: 12, font });
  }
  const bytes = await doc.save();
  const outPath = path.join(outDir, name);
  writeFileSync(outPath, bytes);
  console.log('wrote', outPath, bytes.byteLength, 'bytes');
}

// tiny valid 1x1 PNG (red) and JPEG (white) - enough to exercise embedPng/embedJpg code paths
const PNG_1x1_RED_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const JPG_1x1_WHITE_BASE64 =
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

function makeImage(name, base64) {
  const outPath = path.join(outDir, name);
  writeFileSync(outPath, Buffer.from(base64, 'base64'));
  console.log('wrote', outPath);
}

await makePdf(1, 'sample-1page.pdf');
await makePdf(5, 'sample-5page.pdf');
await makePdf(2, 'sample-2page.pdf');
makeImage('red.png', PNG_1x1_RED_BASE64);
makeImage('white.jpg', JPG_1x1_WHITE_BASE64);

console.log('OUT_DIR=' + outDir);
