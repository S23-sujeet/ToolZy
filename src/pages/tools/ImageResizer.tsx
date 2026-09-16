import { useEffect, useState } from 'react';
import FileDropzone from '../../components/FileDropzone';
import ToolLayout from '../../components/ToolLayout';
import { ImageIcon } from '../../components/icons';
import { downloadBlob } from '../../lib/fileHelpers';
import { resizeImage, type ImageOutputFormat } from '../../lib/imageTools';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState<ImageOutputFormat>('image/jpeg');
  const [quality, setQuality] = useState(0.9);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const selectFile = (selected: File) => {
    const url = URL.createObjectURL(selected);
    const image = new Image();
    image.onload = () => {
      setFile(selected);
      setOriginalSize({ width: image.naturalWidth, height: image.naturalHeight });
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
      setPreviewUrl(url);
      setError(null);
    };
    image.onerror = () => { URL.revokeObjectURL(url); setError('Please choose a valid image file.'); };
    image.src = url;
  };

  const updateWidth = (value: number) => {
    setWidth(value);
    if (keepRatio && originalSize.width) setHeight(Math.max(1, Math.round((value * originalSize.height) / originalSize.width)));
  };

  const updateHeight = (value: number) => {
    setHeight(value);
    if (keepRatio && originalSize.height) setWidth(Math.max(1, Math.round((value * originalSize.width) / originalSize.height)));
  };

  const resize = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const output = await resizeImage(file, { width, height, format, quality });
      const extension = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
      downloadBlob(output.blob, `resized-image-${output.width}x${output.height}.${extension}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resize the image.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title="Image Resizer" description="Resize images by exact pixels while preserving their aspect ratio when needed." seoDescription="Free image resizer for changing image width and height in pixels, with aspect ratio preservation and PNG, JPG or WebP output." path="/tools/image-resizer" icon={ImageIcon}>
      {!file ? <FileDropzone accept="image/png,image/jpeg,image/webp" onFiles={(files) => selectFile(files[0])} label="Drop an image here" hint="PNG, JPG or WebP - processed locally" /> : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500"><span>Original: {originalSize.width} x {originalSize.height}px</span><button type="button" onClick={() => setFile(null)} className="font-semibold text-brand-600 hover:text-brand-700">Choose another image</button></div>
          {previewUrl && <img src={previewUrl} alt="Selected image preview" className="mt-4 max-h-64 w-full rounded-xl border border-slate-200 object-contain" />}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">Width (px)<input type="number" min="1" value={width} onChange={(event) => updateWidth(Number(event.target.value))} className={inputClass} /></label>
            <label className="block text-sm font-medium text-slate-700">Height (px)<input type="number" min="1" value={height} onChange={(event) => updateHeight(Number(event.target.value))} className={inputClass} /></label>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} className="h-4 w-4 accent-brand-600" />Keep aspect ratio</label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">Output format<select value={format} onChange={(event) => setFormat(event.target.value as ImageOutputFormat)} className={inputClass}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
            {format !== 'image/png' && <label className="block text-sm font-medium text-slate-700">Quality: {Math.round(quality * 100)}%<input type="range" min="0.5" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-3 w-full accent-brand-600" /></label>}
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button type="button" disabled={processing} onClick={() => void resize()} className="mt-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:from-brand-700 hover:to-brand-600 disabled:opacity-50">{processing ? 'Resizing...' : 'Resize and download'}</button>
        </>
      )}
    </ToolLayout>
  );
}