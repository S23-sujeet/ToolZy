import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { MergeIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { mergePdfs } from '../../lib/pdfUtils';
import { downloadBytes } from '../../lib/fileHelpers';

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const { status, error, run, reset } = useAsyncTask();

  const addFiles = (newFiles: File[]) => {
    reset();
    setFiles((prev) => [...prev, ...newFiles.filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'))]);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const move = (index: number, direction: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleMerge = () =>
    run(async () => {
      const bytes = await mergePdfs(files);
      downloadBytes(bytes, 'merged.pdf');
    });

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one, in any order you like."
      seoDescription="Merge multiple PDF files into one document for free. Reorder pages before combining. Runs in your browser - no upload required."
      path="/tools/merge-pdf"
      icon={MergeIcon}
    >
      <FileDropzone accept="application/pdf" multiple onFiles={addFiles} label="Drop PDF files here" />

      {files.length > 0 && (
        <ul className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <span className="truncate text-sm text-slate-700">{file.name}</span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === files.length - 1}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={files.length < 2 || status === 'processing'}
          onClick={handleMerge}
          className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {status === 'processing' ? 'Merging...' : `Merge ${files.length || ''} PDF${files.length === 1 ? '' : 's'}`}
        </button>
        {status === 'done' && <span className="text-sm text-green-600">Merged PDF downloaded.</span>}
        {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
      </div>
      {files.length === 1 && <p className="mt-2 text-sm text-slate-400">Add at least 2 PDFs to merge.</p>}
    </ToolLayout>
  );
}
