import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import FileDropzone from '../../components/FileDropzone';
import { ImageIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { imagesToPdf } from '../../lib/pdfUtils';
import { downloadBytes } from '../../lib/fileHelpers';

export default function ImagesToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const { status, error, run, reset } = useAsyncTask();

  const addImages = (files: File[]) => {
    reset();
    setImages((prev) => [...prev, ...files.filter((f) => f.type.startsWith('image/'))]);
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleConvert = () =>
    run(async () => {
      const bytes = await imagesToPdf(images);
      downloadBytes(bytes, 'images.pdf');
    });

  return (
    <ToolLayout
      title="Images to PDF"
      description="Combine JPG or PNG images into a single PDF document."
      seoDescription="Convert JPG or PNG images to PDF for free. Combine multiple images into a single PDF file in your browser."
      path="/tools/images-to-pdf"
      icon={ImageIcon}
    >
      <FileDropzone accept="image/png,image/jpeg" multiple onFiles={addImages} label="Drop images here" />

      {images.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <li key={`${image.name}-${index}`} className="relative overflow-hidden rounded-lg border border-slate-200">
              <img
                src={URL.createObjectURL(image)}
                alt={image.name}
                className="h-28 w-full object-cover"
                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={images.length === 0 || status === 'processing'}
          onClick={handleConvert}
          className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {status === 'processing' ? 'Converting...' : `Convert ${images.length || ''} Image${images.length === 1 ? '' : 's'} to PDF`}
        </button>
        {status === 'done' && <span className="text-sm text-green-600">Download started.</span>}
        {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </ToolLayout>
  );
}
