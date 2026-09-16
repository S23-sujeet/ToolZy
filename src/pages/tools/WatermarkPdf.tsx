import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { WatermarkIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { addWatermark } from '../../lib/pdfUtils';
import { downloadBytes, stripExtension } from '../../lib/fileHelpers';

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const { status, error, run, reset } = useAsyncTask();

  const onFile = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const handleWatermark = () =>
    run(async () => {
      if (!file || !text.trim()) return;
      const bytes = await addWatermark(file, { text: text.trim(), opacity });
      downloadBytes(bytes, `${stripExtension(file.name)}-watermarked.pdf`);
    });

  return (
    <ToolLayout
      title="Add Watermark"
      description="Stamp a custom text watermark diagonally across every page."
      seoDescription="Add a custom text watermark to a PDF for free. Adjustable opacity, stamped across every page in your browser."
      path="/tools/watermark-pdf"
      icon={WatermarkIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong>
          </p>

          <label className="block text-sm font-medium text-slate-700">
            Watermark text
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={60}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Opacity ({Math.round(opacity * 100)}%)
            <input
              type="range"
              min={0.05}
              max={0.8}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleWatermark}
              disabled={!text.trim() || status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Applying...' : 'Add Watermark'}
            </button>
            {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
