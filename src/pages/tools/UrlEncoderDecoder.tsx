import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { LinkIcon } from '../../components/icons';
import { decodeUrl, encodeUrl } from '../../lib/textTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const { output, error } = useMemo(() => {
    try {
      return { output: mode === 'encode' ? encodeUrl(input) : decodeUrl(input), error: null };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [input, mode]);

  const copy = () => output && navigator.clipboard?.writeText(output).catch(() => undefined);

  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description="Encode text for safe use in a URL, or decode a percent-encoded string."
      seoDescription="Free URL encoder and decoder. Encode text for safe use in URLs or decode percent-encoded (URL-encoded) strings instantly."
      path="/tools/url-encoder-decoder"
      icon={LinkIcon}
    >
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'encode', label: 'Encode' },
            { key: 'decode', label: 'Decode' },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setMode(opt.key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              mode === opt.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        {mode === 'encode' ? 'Text to encode' : 'Text to decode'}
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className={textAreaClass} />
      </label>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Result</p>
              <button
                type="button"
                onClick={copy}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 break-all font-mono text-sm text-slate-800">{output}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
