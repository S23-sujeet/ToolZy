import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { TrashIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { deletePages, getPageCount } from '../../lib/pdfUtils';
import { downloadBytes, stripExtension } from '../../lib/fileHelpers';

function parsePageSpec(spec: string, max: number): number[] {
  const pages = new Set<number>();
  for (const part of spec.split(',').map((p) => p.trim()).filter(Boolean)) {
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const [, a, b] = rangeMatch;
      for (let i = Number(a); i <= Number(b); i++) if (i >= 1 && i <= max) pages.add(i);
    } else if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n >= 1 && n <= max) pages.add(n);
    }
  }
  return Array.from(pages);
}

export default function DeletePagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [spec, setSpec] = useState('');
  const loadTask = useAsyncTask();
  const { status, error, run, reset } = useAsyncTask();

  const onFile = async (files: File[]) => {
    const picked = files[0];
    reset();
    setFile(picked);
    setPageCount(null);
    await loadTask.run(async () => {
      setPageCount(await getPageCount(picked));
    });
  };

  const pagesToDelete = pageCount ? parsePageSpec(spec, pageCount) : [];

  const handleDelete = () =>
    run(async () => {
      if (!file) return;
      const bytes = await deletePages(file, pagesToDelete);
      downloadBytes(bytes, `${stripExtension(file.name)}-edited.pdf`);
    });

  return (
    <ToolLayout
      title="Remove Pages"
      description="Delete one or more pages from a PDF document."
      seoDescription="Remove unwanted pages from a PDF for free. Delete single pages or ranges and download the edited file instantly."
      path="/tools/delete-pages"
      icon={TrashIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && pageCount === null && loadTask.status === 'processing' && (
        <p className="text-sm text-slate-400">Reading PDF...</p>
      )}

      {file && pageCount === null && loadTask.status === 'error' && (
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

      {file && pageCount !== null && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong> - {pageCount} page{pageCount === 1 ? '' : 's'}
          </p>

          <label className="block text-sm font-medium text-slate-700">
            Pages to remove
            <input
              type="text"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder="e.g. 1, 3, 5-8"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <p className="text-xs text-slate-400">
            {pagesToDelete.length > 0
              ? `Will remove ${pagesToDelete.length} page(s): ${pagesToDelete.join(', ')}`
              : 'Enter page numbers or ranges separated by commas.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={pagesToDelete.length === 0 || pagesToDelete.length >= pageCount || status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Processing...' : 'Remove Pages'}
            </button>
            {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
          {pagesToDelete.length >= pageCount && pageCount > 0 && (
            <p className="text-sm text-red-500">You can't remove every page - the result would be an empty PDF.</p>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
