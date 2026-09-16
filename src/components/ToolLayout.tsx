import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';
import Seo from './Seo';
import { ArrowRightIcon, ShieldCheckIcon } from './icons';

interface ToolLayoutProps {
  title: string;
  description: string;
  path: string;
  seoDescription?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children: ReactNode;
}

/**
 * Shared shell for every tool page. Ad slots are placed in dedicated zones
 * (top banner, bottom banner, side rail) that are physically separate from
 * the `children` interactive area, so ad rendering/loading can never cover
 * or block the dropzone, buttons, or progress state of a tool.
 */
export default function ToolLayout({ title, description, path, seoDescription, icon: Icon, children }: ToolLayoutProps) {
  return (
    <div className="bg-slate-50">
      <Seo title={title} description={seoDescription ?? description} path={path} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400">
          <Link to="/" className="transition hover:text-brand-600">
            Home
          </Link>
          <ArrowRightIcon className="h-3.5 w-3.5" />
          <span className="font-medium text-slate-600">{title}</span>
        </nav>

        <div className="mt-4 mb-6">
          <AdSlot slotId="tool-top-banner" size="leaderboard" className="h-[90px] w-full" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                {Icon && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h1>
                  <p className="mt-1 text-slate-500">{description}</p>
                </div>
              </div>
              <div className="mt-6">{children}</div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
              Processed locally in your browser - files are never uploaded.
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <AdSlot slotId="tool-sidebar" size="sidebar" />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <AdSlot slotId="tool-bottom-banner" size="banner" className="h-[90px] w-full" />
        </div>
      </div>
    </div>
  );
}
