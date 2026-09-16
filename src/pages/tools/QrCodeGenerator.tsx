import { useEffect, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { QrCodeIcon } from '../../components/icons';
import { generateQrCodePng, type QrErrorCorrection } from '../../lib/qrTools';
import { downloadBlob } from '../../lib/fileHelpers';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrection>('M');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    generateQrCodePng(text, { size: 320, errorCorrection })
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
        setError(err instanceof Error ? err.message : 'Could not generate a QR code.');
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [text, errorCorrection]);

  const download = () => blob && downloadBlob(blob, 'qr-code.png');

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Turn any text, URL or contact info into a scannable QR code."
      seoDescription="Free QR code generator. Turn any text, URL, phone number or contact info into a scannable QR code and download it as a PNG."
      path="/tools/qr-code-generator"
      icon={QrCodeIcon}
    >
      <label className="block text-sm font-medium text-slate-700">
        Text or URL
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className={inputClass} />
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Error correction level
        <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value as QrErrorCorrection)} className={inputClass}>
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
      </label>

      <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          imageUrl && (
            <>
              <img src={imageUrl} alt="Generated QR code" className="h-48 w-48 rounded-lg bg-white p-2 shadow-sm" />
              <button
                type="button"
                onClick={download}
                className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
              >
                Download PNG
              </button>
            </>
          )
        )}
      </div>
    </ToolLayout>
  );
}
