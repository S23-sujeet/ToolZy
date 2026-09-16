import { useState } from 'react';
import CameraScanner from '../../components/CameraScanner';
import FileDropzone from '../../components/FileDropzone';
import ToolLayout from '../../components/ToolLayout';
import { QrCodeIcon } from '../../components/icons';
import { readQrCode } from '../../lib/qrReader';

export default function QrCodeReader() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const scan = async (file: File) => {
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      setResult(await readQrCode(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read the QR code.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title="QR Code Reader" description="Read a QR code from an image and copy its text or link." seoDescription="Free QR code reader that scans uploaded PNG and JPG images locally in your browser." path="/tools/qr-code-reader" icon={QrCodeIcon}>
      <FileDropzone accept="image/png,image/jpeg,image/webp" onFiles={(files) => void scan(files[0])} label="Drop a QR code image here" hint="PNG, JPG or WebP - processed locally" />
      <CameraScanner mode="qr" onResult={(value) => { setError(null); setResult(value); }} />
      {processing && <p className="mt-4 text-center text-sm text-slate-500">Scanning image...</p>}
      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Decoded content</p>
          <p className="mt-2 break-words text-sm text-slate-700">{result}</p>
          <button type="button" onClick={() => void navigator.clipboard?.writeText(result)} className="mt-4 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">Copy result</button>
        </div>
      )}
    </ToolLayout>
  );
}