import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { CompressIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { compressPdf } from '../../lib/pdfUtils';
import { downloadBytes, formatBytes, stripExtension } from '../../lib/fileHelpers';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [resultSize, setResultSize] = useState<number | null>(null);
  const { status, error, run, reset } = useAsyncTask();

  const onFile = (files: File[]) => {
    reset();
    setResultSize(null);
    setFile(files[0]);
  };

  const handleCompress = () =>
    run(async () => {
      if (!file) return;
      const bytes = await compressPdf(file, quality);
      setResultSize(bytes.byteLength);
      downloadBytes(bytes, `${stripExtension(file.name)}-compressed.pdf`);
    });

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size for faster sharing and uploads."
      seoDescription="Compress PDF files for free to reduce file size for email and uploads. Fast, private, browser-based compression."
      path="/tools/compress-pdf"
      icon={CompressIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong> - original size {formatBytes(file.size)}
          </p>

          <div className="flex flex-wrap gap-3">
            {(['low', 'medium', 'high'] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuality(q)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize ${quality === q ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}
              >
                {q} compression
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCompress}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Compressing...' : 'Compress PDF'}
            </button>
            {status === 'done' && resultSize !== null && (
              <span className="text-sm text-green-600">
                Done - new size {formatBytes(resultSize)} ({Math.max(0, Math.round((1 - resultSize / file.size) * 100))}% smaller)
              </span>
            )}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
          <p className="text-xs text-slate-400">
            Compression re-encodes the document structure entirely in your browser. Results vary depending on how the
            original PDF was generated.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
