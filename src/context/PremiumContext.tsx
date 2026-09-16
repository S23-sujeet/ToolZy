import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'pdf-toolkit:premium';

interface PremiumContextValue {
  isPremium: boolean;
  setPremium: (value: boolean) => void;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isPremium));
    } catch {
      // localStorage unavailable (private mode, disabled storage) - ads just stay visible.
    }
  }, [isPremium]);

  const setPremium = useCallback((value: boolean) => setIsPremium(value), []);

  const value = useMemo(() => ({ isPremium, setPremium }), [isPremium, setPremium]);

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium(): PremiumContextValue {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used within a PremiumProvider');
  return ctx;
}
