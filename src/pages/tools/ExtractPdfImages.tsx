import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { ImageIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { extractImagesFromPdf, type ExtractedPdfImage } from '../../lib/pdfImageExtract';
import { downloadAsZip, downloadBlob } from '../../lib/fileHelpers';

export default function ExtractPdfImages() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ExtractedPdfImage[] | null>(null);
  const { status, error, run, reset } = useAsyncTask();

  const previewUrls = useMemo(() => images?.map((img) => URL.createObjectURL(img.blob)) ?? [], [images]);

  const onFile = (files: File[]) => {
    reset();
    setFile(files[0]);
    setImages(null);
  };

  const handleExtract = () =>
    run(async () => {
      if (!file) return;
      setImages(await extractImagesFromPdf(file));
    });

  const downloadAll = async () => {
    if (!images) return;
    if (images.length === 1) {
      downloadBlob(images[0].blob, images[0].fileName);
    } else {
      await downloadAsZip(
        images.map((img) => ({ name: img.fileName, data: img.blob })),
        'extracted-images.zip',
      );
    }
  };

  return (
    <ToolLayout
      title="Extract Images from PDF"
      description="Save the embedded photos and graphics from a PDF as PNG files."
      seoDescription="Extract embedded images from a PDF for free. Save the photos and graphics inside a PDF as PNG files, right in your browser."
      path="/tools/extract-pdf-images"
      icon={ImageIcon}
    >
      {!file && <FileDropzone accept="application/pdf" onFiles={onFile} label="Drop a PDF file here" />}

      {file && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            <strong>{file.name}</strong>
          </p>
          <p className="text-xs text-slate-400">
            Works best on PDFs with embedded photos or graphics - full-page vector/text content won't be extracted as images.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleExtract}
              disabled={status === 'processing'}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {status === 'processing' ? 'Extracting...' : 'Extract Images'}
            </button>
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
          </div>

          {images && images.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">Found {images.length} image(s)</p>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  Download {images.length === 1 ? 'image' : 'all as ZIP'}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
                    <img src={previewUrls[i]} alt={img.fileName} className="mx-auto max-h-24 object-contain" />
                    <p className="mt-1 truncate text-xs text-slate-500">{img.fileName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
