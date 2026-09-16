import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { PdfDocIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { pdfToImages, type ImageFormat } from '../../lib/pdfToImages';
import { downloadAsZip, downloadBlob, stripExtension } from '../../lib/fileHelpers';

export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageFormat>('png');
  const { status, error, run, reset } = useAsyncTask();

  const onFile = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const handleConvert = () =>
    run(async () => {
      if (!file) return;
      const baseName = stripExtension(file.name);
      const images = await pdfToImages(file, { format, baseName });
      if (images.length === 1) {
        downloadBlob(images[0].blob, images[0].fileName);
      } else {
        await downloadAsZip(
          images.map((img) => ({ name: img.fileName, data: img.blob })),
          `${baseName}-images.zip`,
        );
      }
    });

  return (
    <ToolLayout
      title="PDF to Images"
      description="Export every page of a PDF as a PNG or JPG image."
      seoDescription="Convert PDF pages to JPG or PNG images for free, right in your browser. Download single images or a ZIP for multi-page files."
      path="/tools/pdf-to-images"
      icon={PdfDocIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong>
          </p>

          <div className="flex flex-wrap gap-3">
            {(['png', 'jpeg'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium uppercase ${format === f ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleConvert}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Converting...' : 'Convert to Images'}
            </button>
            {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
