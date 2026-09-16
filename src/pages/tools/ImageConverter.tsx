import { useState } from 'react';
import FileDropzone from '../../components/FileDropzone';
import ToolLayout from '../../components/ToolLayout';
import { ImageIcon } from '../../components/icons';
import { downloadBlob, stripExtension } from '../../lib/fileHelpers';
import { convertImage, type ImageOutputFormat } from '../../lib/imageTools';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<ImageOutputFormat>('image/webp');
  const [quality, setQuality] = useState(0.9);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = async () => {
    setProcessing(true);
    setError(null);
    try {
      for (const file of files) {
        const blob = await convertImage(file, format, quality);
        const extension = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
        downloadBlob(blob, `${stripExtension(file.name)}.${extension}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not convert the image.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title="Image Converter" description="Convert JPG, PNG and WebP images locally in your browser." seoDescription="Free image converter for JPG, PNG and WebP files. Convert images privately in your browser with no uploads." path="/tools/image-converter" icon={ImageIcon}>
      {!files.length ? (
        <FileDropzone accept="image/png,image/jpeg,image/webp" multiple onFiles={setFiles} label="Drop images here" hint="JPG, PNG or WebP - processed locally" />
      ) : (
        <>
          <p className="text-sm text-slate-500">{files.length} image{files.length === 1 ? '' : 's'} selected.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">Convert to<select value={format} onChange={(event) => setFormat(event.target.value as ImageOutputFormat)} className={inputClass}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
            {format !== 'image/png' && <label className="block text-sm font-medium text-slate-700">Quality: {Math.round(quality * 100)}%<input type="range" min="0.5" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-3 w-full accent-brand-600" /></label>}
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={processing} onClick={() => void convert()} className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm disabled:opacity-50">{processing ? 'Converting...' : 'Convert and download'}</button><button type="button" onClick={() => setFiles([])} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">Choose other images</button></div>
        </>
      )}
    </ToolLayout>
  );
}
