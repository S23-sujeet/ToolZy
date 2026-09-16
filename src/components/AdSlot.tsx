import { Component, useEffect, useRef, type ReactNode } from 'react';
import { usePremium } from '../context/PremiumContext';

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
let scriptLoadPromise: Promise<void> | null = null;

function loadAdSenseScript(client: string): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load AdSense script'));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

/** Isolates ad failures so a broken/blocked ad script can never break tool functionality. */
class AdErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[AdSlot] suppressed ad rendering error:', error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export type AdSlotSize = 'banner' | 'rectangle' | 'leaderboard' | 'sidebar';

const SIZE_STYLES: Record<AdSlotSize, { width: number; height: number }> = {
  banner: { width: 728, height: 90 },
  leaderboard: { width: 970, height: 90 },
  rectangle: { width: 300, height: 250 },
  sidebar: { width: 300, height: 600 },
};

interface AdSlotProps {
  slotId: string;
  size?: AdSlotSize;
  className?: string;
  label?: string;
}

function AdUnit({ slotId, size = 'rectangle', className, label = 'Advertisement' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPremium } = usePremium();
  const dimensions = SIZE_STYLES[size];

  useEffect(() => {
    if (isPremium || !ADSENSE_CLIENT) return;
    let cancelled = false;

    loadAdSenseScript(ADSENSE_CLIENT)
      .then(() => {
        if (cancelled) return;
        try {
          // Reserved space via CSS below prevents layout shift / overlap with tool UI.
          ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ??= []).push({});
        } catch (error) {
          console.warn('[AdSlot] adsbygoogle push failed:', error);
        }
      })
      .catch((error) => console.warn('[AdSlot]', error));

    return () => {
      cancelled = true;
    };
  }, [isPremium]);

  // Premium users (or missing config, e.g. local dev) never see ad markup at all.
  if (isPremium || !ADSENSE_CLIENT) return null;

  return (
    <div
      ref={containerRef}
      className={`mx-auto flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-100 text-xs text-slate-400 ${className ?? ''}`}
      style={{ minWidth: Math.min(dimensions.width, 320), minHeight: dimensions.height }}
      data-ad-slot={slotId}
      aria-label={label}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/** Public ad slot component: safe to place anywhere without risking tool functionality. */
export default function AdSlot(props: AdSlotProps) {
  return (
    <AdErrorBoundary>
      <AdUnit {...props} />
    </AdErrorBoundary>
  );
}
