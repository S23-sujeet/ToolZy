import { Link } from 'react-router-dom';
import { usePremium } from '../context/PremiumContext';
import { LogoMark, SparklesIcon } from './icons';

export default function Header() {
  const { isPremium, setPremium } = usePremium();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-3.5">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-base font-bold tracking-tight whitespace-nowrap text-slate-800 sm:gap-2.5 sm:text-lg"
        >
          <LogoMark className="h-7 w-7 sm:h-8 sm:w-8" />
          Toolzy
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600 sm:gap-2">
          <Link
            to="/"
            className="rounded-lg px-2 py-1.5 whitespace-nowrap transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 sm:py-2"
          >
            All Tools
          </Link>
          <Link
            to="/premium"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap transition sm:px-3.5 sm:py-2 sm:text-sm ${
              isPremium
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm shadow-brand-600/20 hover:from-brand-700 hover:to-brand-600'
            }`}
          >
            <SparklesIcon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{isPremium ? 'Premium active' : 'Go Premium'}</span>
            <span className="sm:hidden">Premium</span>
          </Link>
          {isPremium && (
            <button
              type="button"
              onClick={() => setPremium(false)}
              className="text-xs whitespace-nowrap text-slate-400 underline underline-offset-2 hover:text-slate-600"
            >
              exit
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
