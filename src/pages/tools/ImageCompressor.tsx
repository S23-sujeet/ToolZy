import { useState } from 'react';
import FileDropzone from '../../components/FileDropzone';
import ToolLayout from '../../components/ToolLayout';
import { CompressIcon } from '../../components/icons';
import { downloadBlob, stripExtension } from '../../lib/fileHelpers';
import { convertImage } from '../../lib/imageTools';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compress = async () => {
    setProcessing(true);
    setError(null);
    try {
      for (const file of files) {
        const blob = await convertImage(file, 'image/jpeg', quality);
        downloadBlob(blob, `${stripExtension(file.name)}-compressed.jpg`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not compress the image.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title="Image Compressor" description="Reduce JPG, PNG and WebP file sizes with adjustable quality." seoDescription="Free image compressor for reducing JPG, PNG and WebP file sizes in your browser. No uploads or sign-up required." path="/tools/image-compressor" icon={CompressIcon}>
      {!files.length ? (
        <FileDropzone accept="image/png,image/jpeg,image/webp" multiple onFiles={setFiles} label="Drop images here" hint="JPG, PNG or WebP - processed locally" />
      ) : (
        <>
          <p className="text-sm text-slate-500">{files.length} image{files.length === 1 ? '' : 's'} selected. Compressed files download as JPG.</p>
          <label className="mt-5 block text-sm font-medium text-slate-700">Quality: {Math.round(quality * 100)}%<input type="range" min="0.2" max="0.9" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className={inputClass} /></label>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={processing} onClick={() => void compress()} className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm disabled:opacity-50">{processing ? 'Compressing...' : 'Compress and download'}</button><button type="button" onClick={() => setFiles([])} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">Choose other images</button></div>
        </>
      )}
    </ToolLayout>
  );
}
