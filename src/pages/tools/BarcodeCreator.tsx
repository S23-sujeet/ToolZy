import { useEffect, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { QrCodeIcon } from '../../components/icons';
import { generateBarcodePng, type BarcodeFormat } from '../../lib/barcodeTools';
import { downloadBlob } from '../../lib/fileHelpers';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function BarcodeCreator() {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState<BarcodeFormat>('code128');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    generateBarcodePng(text, format)
      .then((generatedBlob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(generatedBlob);
        setImageUrl(objectUrl);
        setBlob(generatedBlob);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setImageUrl(null);
        setBlob(null);
        setError(err instanceof Error ? err.message : 'Could not create a barcode.');
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [text, format]);

  return (
    <ToolLayout
      title="Barcode Creator"
      description="Create a downloadable barcode from text or numbers, entirely in your browser."
      seoDescription="Free barcode creator for Code 128, EAN-13 and UPC-A barcodes. Generate and download barcode PNG images locally."
      path="/tools/barcode-creator"
      icon={QrCodeIcon}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Barcode value
          <input value={text} onChange={(event) => setText(event.target.value)} className={inputClass} placeholder="Enter text or numbers" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Format
          <select value={format} onChange={(event) => setFormat(event.target.value as BarcodeFormat)} className={inputClass}>
            <option value="code128">Code 128 - text or numbers</option>
            <option value="ean13">EAN-13 - 12 or 13 digits</option>
            <option value="upca">UPC-A - 11 or 12 digits</option>
          </select>
        </label>
      </div>
      <div className="mt-6 flex min-h-48 flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        {error ? <p className="text-sm text-red-600">{error}</p> : imageUrl && <img src={imageUrl} alt="Generated barcode" className="max-w-full bg-white p-3" />}
        {blob && <button type="button" onClick={() => downloadBlob(blob, 'barcode.png')} className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:from-brand-700 hover:to-brand-600">Download PNG</button>}
      </div>
    </ToolLayout>
  );
}