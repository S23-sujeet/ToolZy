import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { DocTextIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { extractTextFromPdf, type PdfPageText } from '../../lib/pdfTextExtract';
import { downloadBlob, stripExtension } from '../../lib/fileHelpers';

export default function ExtractPdfText() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageText[] | null>(null);
  const { status, error, run, reset } = useAsyncTask();

  const onFile = (files: File[]) => {
    reset();
    setFile(files[0]);
    setPages(null);
  };

  const handleExtract = () =>
    run(async () => {
      if (!file) return;
      setPages(await extractTextFromPdf(file));
    });

  const combinedText = pages?.map((p) => `--- Page ${p.pageNumber} ---\n${p.text}`).join('\n\n') ?? '';

  const download = () => {
    if (!file || !pages) return;
    const blob = new Blob([combinedText], { type: 'text/plain' });
    downloadBlob(blob, `${stripExtension(file.name)}-text.txt`);
  };

  return (
    <ToolLayout
      title="Extract Text from PDF"
      description="Pull the plain text out of every page of a PDF document."
      seoDescription="Extract text from a PDF for free. Pull the plain text out of every page and download it, or copy it directly, right in your browser."
      path="/tools/extract-pdf-text"
      icon={DocTextIcon}
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
              onClick={handleExtract}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Extracting...' : 'Extract Text'}
            </button>
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>

          {pages && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  Extracted text ({pages.length} page{pages.length === 1 ? '' : 's'})
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(combinedText).catch(() => undefined)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                  >
                    Copy all
                  </button>
                  <button
                    type="button"
                    onClick={download}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                  >
                    Download .txt
                  </button>
                </div>
              </div>
              <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                {combinedText || '(No text found - this PDF may be scanned/image-only.)'}
              </pre>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
