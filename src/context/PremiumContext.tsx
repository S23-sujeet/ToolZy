import { createContext, useContext, type ReactNode } from 'react';

interface PremiumContextValue {
  isPremium: boolean;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  return <PremiumContext.Provider value={{ isPremium: false }}>{children}</PremiumContext.Provider>;
}

export function usePremium(): PremiumContextValue {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used within a PremiumProvider');
  return ctx;
}
