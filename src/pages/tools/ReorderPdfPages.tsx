import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { ReorderIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { getPageCount, reorderPdfPages } from '../../lib/pdfUtils';
import { downloadBytes, stripExtension } from '../../lib/fileHelpers';

export default function ReorderPdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState<number[] | null>(null);
  const loadTask = useAsyncTask();
  const { status, error, run, reset } = useAsyncTask();

  const onFile = async (files: File[]) => {
    const picked = files[0];
    reset();
    setFile(picked);
    setOrder(null);
    await loadTask.run(async () => {
      const count = await getPageCount(picked);
      setOrder(Array.from({ length: count }, (_, i) => i + 1));
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    setOrder((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleReorder = () =>
    run(async () => {
      if (!file || !order) return;
      const bytes = await reorderPdfPages(file, order);
      downloadBytes(bytes, `${stripExtension(file.name)}-reordered.pdf`);
    });

  return (
    <ToolLayout
      title="Reorder PDF Pages"
      description="Rearrange the page order of a PDF document."
      seoDescription="Reorder PDF pages for free. Move pages up and down to rearrange a PDF's page order and download the result instantly."
      path="/tools/reorder-pdf-pages"
      icon={ReorderIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && order === null && loadTask.status === 'processing' && <p className="text-sm text-slate-400">Reading PDF...</p>}

      {file && order === null && loadTask.status === 'error' && (
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

      {file && order !== null && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong> - {order.length} page{order.length === 1 ? '' : 's'}
          </p>
          <p className="text-xs text-slate-400">Use the arrows to move pages into the order you want.</p>

          <div className="max-h-96 space-y-2 overflow-auto">
            {order.map((pageNumber, index) => (
              <div key={pageNumber} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
                <span className="text-sm font-medium text-slate-700">Page {pageNumber}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === order.length - 1}
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleReorder}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Processing...' : 'Save Reordered PDF'}
            </button>
            {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
