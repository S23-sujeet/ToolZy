import { Link } from 'react-router-dom';
import AdSlot from '../components/AdSlot';
import Seo from '../components/Seo';
import ToolCard from '../components/ToolCard';
import { ArrowRightIcon, ShieldCheckIcon } from '../components/icons';
import { getSection, getToolsBySection, type Section } from '../lib/tools';

/** Generic category hub page - renders identically for every section (PDF Toolkit included). */
export default function CategoryHub({ section: sectionId }: { section: Section }) {
  const section = getSection(sectionId);
  const tools = getToolsBySection(sectionId);
  const Icon = section.icon;

  return (
    <div className="bg-slate-50">
      <Seo
        title={`${section.label} - Free Online Tools`}
        description={`${section.description} ${tools.length} free tools, running entirely in your browser - no sign-up, no uploads.`}
        path={section.path}
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400">
          <Link to="/" className="transition hover:text-brand-600">
            Home
          </Link>
          <ArrowRightIcon className="h-3.5 w-3.5" />
          <span className="font-medium text-slate-600">{section.label}</span>
        </nav>

        <div className="mt-4 flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${section.iconGradient} text-white shadow-sm`}
          >
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{section.label}</h1>
            <p className="mt-1 max-w-2xl text-slate-500">
              {tools.length} free tools - {section.description} No sign-up, no uploads, everything runs locally in
              your browser.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
          Nothing you enter here is ever uploaded to a server.
        </div>

        <div className="mt-8">
          <AdSlot slotId={`${sectionId}-hub-top-banner`} size="leaderboard" className="mx-auto h-[90px] w-full max-w-4xl" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        <div className="mt-10">
          <AdSlot slotId={`${sectionId}-hub-bottom-banner`} size="leaderboard" className="mx-auto h-[90px] w-full max-w-4xl" />
        </div>
      </div>
    </div>
  );
}
