import { useCallback, useRef, useState, type DragEvent } from 'react';
import { UploadIcon } from './icons';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

export default function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  label = 'Drag & drop files here',
  hint = 'or click to browse from your device',
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFiles(Array.from(fileList));
    },
    [onFiles],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
      }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all duration-150 ${
        isDragging
          ? 'scale-[1.01] border-brand-500 bg-brand-50'
          : 'border-slate-300 bg-slate-50/60 hover:border-brand-400 hover:bg-brand-50/40'
      }`}
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
          isDragging ? 'bg-brand-100 text-brand-600' : 'bg-white text-slate-400 shadow-sm ring-1 ring-slate-200'
        }`}
      >
        <UploadIcon className="h-6 w-6" strokeWidth={1.6} />
      </div>
      <p className="text-lg font-semibold text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-400">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
