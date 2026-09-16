import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { InfoIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { getPdfMetadata, setPdfMetadata, type PdfMetadata } from '../../lib/pdfUtils';
import { downloadBytes, stripExtension } from '../../lib/fileHelpers';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const loadTask = useAsyncTask();
  const { status, error, run, reset } = useAsyncTask();

  const onFile = async (files: File[]) => {
    const picked = files[0];
    reset();
    setFile(picked);
    setMetadata(null);
    await loadTask.run(async () => {
      setMetadata(await getPdfMetadata(picked));
    });
  };

  const updateField = (field: keyof PdfMetadata, value: string) => {
    setMetadata((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = () =>
    run(async () => {
      if (!file || !metadata) return;
      const bytes = await setPdfMetadata(file, metadata);
      downloadBytes(bytes, `${stripExtension(file.name)}-updated.pdf`);
    });

  return (
    <ToolLayout
      title="Edit PDF Metadata"
      description="View and update a PDF's title, author, subject and keywords."
      seoDescription="Edit PDF metadata for free. View and update a PDF's title, author, subject and keywords, and download the updated file instantly."
      path="/tools/pdf-metadata-editor"
      icon={InfoIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && metadata === null && loadTask.status === 'processing' && <p className="text-sm text-slate-400">Reading PDF...</p>}

      {file && metadata === null && loadTask.status === 'error' && (
        <div className="space-y-3">
          <p className="text-sm text-red-600">{loadTask.error ?? 'This file could not be read as a PDF.'}</p>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              loadTask.reset();
            }}
            className="text-sm text-slate-500 underline"
          >
            choose another file
          </button>
        </div>
      )}

      {file && metadata !== null && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong>
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Title
              <input type="text" value={metadata.title} onChange={(e) => updateField('title', e.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Author
              <input type="text" value={metadata.author} onChange={(e) => updateField('author', e.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Subject
              <input type="text" value={metadata.subject} onChange={(e) => updateField('subject', e.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Keywords (comma-separated)
              <input type="text" value={metadata.keywords} onChange={(e) => updateField('keywords', e.target.value)} className={inputClass} />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Saving...' : 'Save PDF'}
            </button>
            {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
