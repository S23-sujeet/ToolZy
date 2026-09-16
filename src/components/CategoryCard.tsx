import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons';
import type { SectionDefinition } from '../lib/tools';

/** Uniform "browse by category" tile - used identically for every section, including PDF Toolkit. */
export default function CategoryCard({ section, toolCount }: { section: SectionDefinition; toolCount: number }) {
  const Icon = section.icon;

  return (
    <Link
      to={section.path}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${section.iconGradient} text-white shadow-sm`}
      >
        <Icon className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <span
        className={`absolute right-5 top-5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${section.badge}`}
      >
        {toolCount} tools
      </span>
      <h3 className="text-lg font-bold text-slate-800">{section.label}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{section.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        Explore tools
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
