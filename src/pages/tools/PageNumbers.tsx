import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { HashIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { addPageNumbers } from '../../lib/pdfUtils';
import { downloadBytes, stripExtension } from '../../lib/fileHelpers';

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const { status, error, run, reset } = useAsyncTask();

  const onFile = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const handleAddNumbers = () =>
    run(async () => {
      if (!file) return;
      const bytes = await addPageNumbers(file);
      downloadBytes(bytes, `${stripExtension(file.name)}-numbered.pdf`);
    });

  return (
    <ToolLayout
      title="Add Page Numbers"
      description="Insert 'page X of N' numbering at the bottom of every page."
      seoDescription="Add page numbers to a PDF for free. Insert 'page X of N' footers on every page in seconds."
      path="/tools/page-numbers"
      icon={HashIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleAddNumbers}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Adding...' : 'Add Page Numbers'}
            </button>
            {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
