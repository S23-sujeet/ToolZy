import { useState } from 'react';
import CameraScanner from '../../components/CameraScanner';
import FileDropzone from '../../components/FileDropzone';
import ToolLayout from '../../components/ToolLayout';
import { QrCodeIcon } from '../../components/icons';
import { readBarcode } from '../../lib/barcodeReader';

export default function BarcodeReader() {
  const [result, setResult] = useState<{ text: string; format: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const scan = async (file: File) => {
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      setResult(await readBarcode(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read the barcode.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title="Barcode Reader" description="Read a barcode from an image using your browser." seoDescription="Free barcode reader for scanning uploaded barcode images locally in your browser." path="/tools/barcode-reader" icon={QrCodeIcon}>
      <FileDropzone accept="image/png,image/jpeg,image/webp" onFiles={(files) => void scan(files[0])} label="Drop a barcode image here" hint="PNG, JPG or WebP - processed locally" />
      <CameraScanner mode="barcode" onResult={(value, format) => { setError(null); setResult({ text: value, format: format ?? 'Barcode' }); }} />
      {processing && <p className="mt-4 text-center text-sm text-slate-500">Scanning image...</p>}
      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">{result.format}</p>
          <p className="mt-2 break-words text-lg font-semibold text-slate-700">{result.text}</p>
          <button type="button" onClick={() => void navigator.clipboard?.writeText(result.text)} className="mt-4 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">Copy result</button>
        </div>
      )}
    </ToolLayout>
  );
}