import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { TextIcon } from '../../components/icons';
import { generateLoremIpsum } from '../../lib/textTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(40);

  const { output, error } = useMemo(() => {
    try {
      return { output: generateLoremIpsum(paragraphs, wordsPerParagraph), error: null };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Invalid input.' };
    }
  }, [paragraphs, wordsPerParagraph]);

  const copy = () => output && navigator.clipboard?.writeText(output).catch(() => undefined);

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder paragraphs of Lorem Ipsum text."
      seoDescription="Free Lorem Ipsum generator. Generate placeholder paragraphs of classic Lorem Ipsum text for mockups, designs and layouts."
      path="/tools/lorem-ipsum-generator"
      icon={TextIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Paragraphs
          <input
            type="number"
            value={paragraphs}
            onChange={(e) => setParagraphs(Number(e.target.value))}
            className={inputClass}
            min={1}
            max={50}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Words per paragraph
          <input
            type="number"
            value={wordsPerParagraph}
            onChange={(e) => setWordsPerParagraph(Number(e.target.value))}
            className={inputClass}
            min={5}
            max={300}
          />
        </label>
      </div>

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
            <div className="mt-2 max-h-96 space-y-3 overflow-auto text-sm text-slate-800">
              {output.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
