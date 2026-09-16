import { useState, type ReactNode } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { DiceIcon } from '../../components/icons';
import { flipCoins, randomInt, rollDice } from '../../lib/idTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

type Mode = 'number' | 'dice' | 'coin';

const TABS: Array<{ key: Mode; label: string }> = [
  { key: 'number', label: 'Random Number' },
  { key: 'dice', label: 'Dice Roller' },
  { key: 'coin', label: 'Coin Flip' },
];

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
        active ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function ResultBox({ children }: { children: ReactNode }) {
  return <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">{children}</div>;
}

function RandomNumberTab() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    try {
      setResult(randomInt(min, max));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Enter a valid range.');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Minimum
          <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Maximum
          <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className={inputClass} />
        </label>
      </div>
      <button
        type="button"
        onClick={generate}
        className="mt-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
      >
        Generate
      </button>
      <ResultBox>
        {error ? <p className="text-sm text-red-600">{error}</p> : result !== null && <p className="text-3xl font-bold text-slate-800">{result}</p>}
      </ResultBox>
    </div>
  );
}

function DiceRollerTab() {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(2);
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    try {
      setResult(rollDice(sides, count));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Enter valid dice settings.');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Sides per die
          <input type="number" value={sides} onChange={(e) => setSides(Number(e.target.value))} className={inputClass} min={2} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Number of dice
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className={inputClass} min={1} max={20} />
        </label>
      </div>
      <button
        type="button"
        onClick={generate}
        className="mt-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
      >
        Roll
      </button>
      <ResultBox>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div>
              <p className="flex flex-wrap gap-2 text-2xl font-bold text-slate-800">
                {result.map((r, i) => (
                  <span key={i} className="rounded-lg border border-slate-300 bg-white px-3 py-1">
                    {r}
                  </span>
                ))}
              </p>
              <p className="mt-2 text-sm text-slate-500">Total: {result.reduce((a, b) => a + b, 0)}</p>
            </div>
          )
        )}
      </ResultBox>
    </div>
  );
}

function CoinFlipTab() {
  const [count, setCount] = useState(1);
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    try {
      setResult(flipCoins(count));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Enter a valid number of coins.');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        Number of coins
        <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className={`${inputClass} w-32`} min={1} max={50} />
      </label>
      <button
        type="button"
        onClick={generate}
        className="mt-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
      >
        Flip
      </button>
      <ResultBox>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <p className="flex flex-wrap gap-2 text-lg font-bold text-slate-800">
              {result.map((r, i) => (
                <span key={i} className="rounded-lg border border-slate-300 bg-white px-3 py-1">
                  {r}
                </span>
              ))}
            </p>
          )
        )}
      </ResultBox>
    </div>
  );
}

export default function RandomGenerator() {
  const [mode, setMode] = useState<Mode>('number');

  return (
    <ToolLayout
      title="Random Number / Dice / Coin Flip"
      description="Generate random numbers, roll dice, or flip a coin."
      seoDescription="Free random generator. Generate random numbers in a range, roll virtual dice, or flip a virtual coin - all using a secure random source."
      path="/tools/random-generator"
      icon={DiceIcon}
    >
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <TabButton key={tab.key} active={mode === tab.key} onClick={() => setMode(tab.key)}>
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="mt-6">
        {mode === 'number' && <RandomNumberTab />}
        {mode === 'dice' && <DiceRollerTab />}
        {mode === 'coin' && <CoinFlipTab />}
      </div>
    </ToolLayout>
  );
}
