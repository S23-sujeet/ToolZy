import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { TextIcon } from '../../components/icons';
import { analyzeText } from '../../lib/textTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => analyzeText(text), [text]);

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: stats.readingTimeMinutes ? `${stats.readingTimeMinutes} min` : '0 min' },
  ];

  return (
    <ToolLayout
      title="Word & Character Counter"
      description="Count words, characters, sentences and estimated reading time."
      seoDescription="Free word counter and character counter. Instantly see word count, character count, sentence count and reading time."
      path="/tools/word-counter"
      icon={TextIcon}
    >
      <label className="block text-sm font-medium text-slate-700">
        Your text
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste or type your text here..."
          className={textAreaClass}
        />
      </label>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xl font-bold text-slate-800">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
