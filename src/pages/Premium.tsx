import { usePremium } from '../context/PremiumContext';
import { CheckIcon, ShieldCheckIcon, SparklesIcon } from '../components/icons';
import Seo from '../components/Seo';

const FEATURES = [
  'Completely ad-free experience across every tool',
  'Priority processing for large, multi-hundred-page PDFs',
  'Higher batch limits for merge, split and image conversion',
  'Support future tool development',
];

/**
 * Placeholder premium/checkout page. In production, `setPremium(true)` should
 * only run after a real payment provider (Stripe, Paddle, etc.) confirms
 * a successful subscription via webhook - not directly from client code.
 */
export default function Premium() {
  const { isPremium, setPremium } = usePremium();

  return (
    <div className="bg-slate-50 py-16">
      <Seo
        title="Go Premium - Ad-Free PDF Tools"
        description="Upgrade to an ad-free experience with higher batch limits across every PDF tool."
        path="/premium"
      />
      <div className="mx-auto max-w-2xl px-4 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25">
          <SparklesIcon className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Go Premium</h1>
        <p className="mt-3 text-slate-500">Remove ads and unlock higher usage limits, for a small monthly cost.</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm">
          <ul className="space-y-3.5">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
                <span className="text-slate-600">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-slate-100 pt-6">
            {isPremium ? (
              <p className="flex items-center justify-center gap-2 font-medium text-emerald-600">
                <ShieldCheckIcon className="h-5 w-5" />
                You already have Premium active on this device.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setPremium(true)}
                className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-600"
              >
                Simulate Premium Upgrade (demo)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
