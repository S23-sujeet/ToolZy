import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function downloadBytes(bytes: Uint8Array, fileName: string, mimeType = 'application/pdf') {
  const view = new Uint8Array(bytes);
  const blob = new Blob([view], { type: mimeType });
  saveAs(blob, fileName);
}

export function downloadBlob(blob: Blob, fileName: string) {
  saveAs(blob, fileName);
}

export async function downloadAsZip(files: Array<{ name: string; data: Blob | Uint8Array }>, zipName: string) {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.data);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}

export function stripExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.');
  return idx === -1 ? fileName : fileName.slice(0, idx);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}
