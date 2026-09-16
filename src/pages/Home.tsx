import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdSlot from '../components/AdSlot';
import Seo from '../components/Seo';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import { SECTIONS, getPopularTools, getToolsBySection, searchTools } from '../lib/tools';
import {
  ArrowRightIcon,
  BoltIcon,
  DeviceIcon,
  MergeIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from '../components/icons';

const TOTAL_TOOL_COUNT = SECTIONS.reduce((sum, s) => sum + getToolsBySection(s.id).length, 0);
const POPULAR_TOOLS = getPopularTools();

const TRUST_POINTS = [
  { icon: ShieldCheckIcon, label: 'Files never uploaded' },
  { icon: BoltIcon, label: 'Instant, in-browser processing' },
  { icon: DeviceIcon, label: 'Works on any device' },
  { icon: SparklesIcon, label: '100% free to use' },
];

const STEPS = [
  {
    icon: SparklesIcon,
    title: 'Choose a tool',
    description: 'Choose from PDF tools, converters, calculators, text utilities and more.',
  },
  {
    icon: DeviceIcon,
    title: 'Enter your details',
    description: 'Upload a file or enter your numbers, dates or text, depending on the tool.',
  },
  {
    icon: ArrowRightIcon,
    title: 'Get your result',
    description: 'Download your file or copy the result instantly, with everything processed in your browser.',
  },
];

const TESTIMONIALS = [
  { initials: 'AR', name: 'Aditi R.', role: 'Freelance Designer', quote: 'Clean, fast, and I never worry about where my files end up.' },
  { initials: 'MK', name: 'Marcus K.', role: 'Small Business Owner', quote: 'Merging invoices used to take forever. Now it is a 10-second job.' },
  { initials: 'SP', name: 'Sara P.', role: 'Graduate Student', quote: 'The compress tool shrank my thesis PDF enough to email it directly.' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const searchResults = useMemo(() => searchTools(query), [query]);
  const isSearching = query.trim().length > 0;

  return (
    <div>
      <Seo
        title="Free Online Tools - PDF, Converters & Calculators"
        description="PDF tools, currency/unit/timezone converters, calculators, text tools and more - all free and running locally in your browser. No sign-up, no uploads."
        path="/"
      />
      {/* Hero */}
      <section className="bg-hero-mesh relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10">
            <SparklesIcon className="h-3.5 w-3.5" />
            No sign-up. No uploads. No limits.
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Every everyday tool you need, <span className="text-brand-600">in one place</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">
            Free PDF tools, everyday converters, calculators, text utilities and number tools, all running privately
            in your browser. No sign-up and no uploads.
          </p>

          {/* Search - the fastest path to any of the 25 tools */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${TOTAL_TOOL_COUNT} tools... e.g. "merge pdf", "BMI", "currency"`}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pr-4 pl-12 text-base text-slate-800 shadow-lg shadow-slate-900/5 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#tools"
              className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-600 sm:w-auto"
            >
              Browse all tools
            </a>
            <Link
              to="/tools/merge-pdf"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
            >
              <MergeIcon className="h-4.5 w-4.5" />
              Try Merge PDF
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-slate-100">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-2 py-8">
          <AdSlot slotId="home-top-banner" size="leaderboard" className="mx-auto h-[90px] w-full max-w-4xl" />
        </div>
      </div>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-6">
        {isSearching ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
              >
                Clear search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-400">
                No tools match &ldquo;{query}&rdquo;. Try a different keyword, or browse by category below.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">All the tools, zero cost</h2>
              <p className="mt-2 text-slate-500">
                {TOTAL_TOOL_COUNT} focused tools across PDFs, everyday conversions, calculators, text/data and
                numbers and image utilities - organized into six simple categories.
              </p>
            </div>

            {/* Popular tools - one-click shortcuts to the most-used tools across every category */}
            <div className="mt-10">
              <p className="text-center text-xs font-semibold tracking-wide text-slate-400 uppercase">Popular right now</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {POPULAR_TOOLS.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-md"
                  >
                    <tool.icon className="h-4 w-4" />
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Browse by category - every section gets the exact same card treatment, PDF Toolkit included */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {SECTIONS.map((section) => (
                <CategoryCard key={section.id} section={section} toolCount={getToolsBySection(section.id).length} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* How it works */}
      <section className="mt-20 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">How it works</h2>
            <p className="mt-2 text-slate-500">Find the right tool, provide what it needs, and get an instant result.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white shadow">
                  {index + 1}
                </span>
                <div className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Trusted by everyday users</h2>
          <p className="mt-2 text-slate-500">No account required, so people come back because it simply works.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-4">
        <AdSlot slotId="home-bottom-banner" size="leaderboard" className="mx-auto h-[90px] w-full max-w-4xl" />
      </div>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-8 py-14 text-center shadow-xl">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl">Want an ad-free experience?</h2>
          <p className="relative mx-auto mt-2 max-w-lg text-brand-50">
            Help keep Toolzy free, privacy-first, and improving with a small contribution.
          </p>
          <Link
            to="/premium"
            className="relative mt-6 inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
          >
            <SparklesIcon className="h-4 w-4" />
            Support Toolzy
          </Link>
        </div>
      </section>
    </div>
  );
}
