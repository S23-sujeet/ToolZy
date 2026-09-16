import { Link } from 'react-router-dom';
import { SECTIONS, getToolsBySection } from '../lib/tools';
import { LogoMark, ShieldCheckIcon } from './icons';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-base font-bold text-slate-800">
              <LogoMark className="h-7 w-7" />
              Toolzy
            </Link>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-500" />
              Nothing you enter ever leaves your device.
            </p>
          </div>

          {SECTIONS.map((section) => {
            const tools = getToolsBySection(section.id);
            return (
              <div key={section.id}>
                <h4 className="text-sm font-semibold text-slate-800">{section.shortLabel}</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-500">
                  {tools.slice(0, 5).map((t) => (
                    <li key={t.slug}>
                      <Link to={`/tools/${t.slug}`} className="transition hover:text-brand-600">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to={section.path} className="font-medium text-brand-600 transition hover:text-brand-700">
                      View all {tools.length} tools
                    </Link>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Toolzy. All rights reserved.</p>
          <p>Built with React, pdf-lib &amp; pdf.js.</p>
        </div>
      </div>
    </footer>
  );
}
