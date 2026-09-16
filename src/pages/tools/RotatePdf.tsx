import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { RotateIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { rotatePdf, type RotationAngle } from '../../lib/pdfUtils';
import { downloadBytes, stripExtension } from '../../lib/fileHelpers';

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<RotationAngle>(90);
  const { status, error, run, reset } = useAsyncTask();

  const onFile = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const handleRotate = () =>
    run(async () => {
      if (!file) return;
      const bytes = await rotatePdf(file, angle);
      downloadBytes(bytes, `${stripExtension(file.name)}-rotated.pdf`);
    });

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate every page of a PDF clockwise by a fixed angle."
      seoDescription="Rotate PDF pages 90, 180 or 270 degrees for free. Fix sideways or upside-down scans instantly in your browser."
      path="/tools/rotate-pdf"
      icon={RotateIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong>
          </p>

          <div className="flex flex-wrap gap-3">
            {[90, 180, 270].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAngle(a as RotationAngle)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${angle === a ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}
              >
                {a}&deg;
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleRotate}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Rotating...' : 'Rotate PDF'}
            </button>
            <button type="button" onClick={() => { setFile(null); reset(); }} className="text-sm text-slate-500 underline">
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
