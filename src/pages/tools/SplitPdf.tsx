import { useEffect, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { SplitIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { extractPageRange, getPageCount, splitPdf } from '../../lib/pdfUtils';
import { downloadAsZip, downloadBytes, stripExtension } from '../../lib/fileHelpers';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<'range' | 'each'>('range');
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const loadTask = useAsyncTask();
  const { status, error, run, reset } = useAsyncTask();

  const onFile = async (files: File[]) => {
    const picked = files[0];
    reset();
    setFile(picked);
    setPageCount(null);
    await loadTask.run(async () => {
      const count = await getPageCount(picked);
      setPageCount(count);
      setStart(1);
      setEnd(count);
    });
  };

  useEffect(() => {
    if (pageCount) setEnd((prev) => Math.min(prev, pageCount));
  }, [pageCount]);

  const handleSplit = () =>
    run(async () => {
      if (!file) return;
      const baseName = stripExtension(file.name);
      if (mode === 'range') {
        const bytes = await extractPageRange(file, start, end);
        downloadBytes(bytes, `${baseName}-pages-${start}-${end}.pdf`);
      } else {
        const parts = await splitPdf(file, baseName);
        await downloadAsZip(
          parts.map(([name, data]) => ({ name, data })),
          `${baseName}-split.zip`,
        );
      }
    });

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract a page range, or break a PDF into single pages."
      seoDescription="Split a PDF into multiple files or extract a page range for free. Download individual pages as a ZIP, right in your browser."
      path="/tools/split-pdf"
      icon={SplitIcon}
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setMode('range')}
              className={`rounded-lg border px-4 py-2 text-sm font-medium ${mode === 'range' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}
            >
              Extract page range
            </button>
            <button
              type="button"
              onClick={() => setMode('each')}
              className={`rounded-lg border px-4 py-2 text-sm font-medium ${mode === 'each' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}
            >
              Split every page (ZIP)
            </button>
          </div>

          {mode === 'range' && (
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-slate-600">
                From
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                  className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
                />
              </label>
              <label className="text-sm text-slate-600">
                To
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={end}
                  onChange={(e) => setEnd(Number(e.target.value))}
                  className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSplit}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Processing...' : 'Split PDF'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPageCount(null);
                loadTask.reset();
                reset();
              }}
              className="text-sm text-slate-500 underline"
            >
              choose another file
            </button>
            {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
