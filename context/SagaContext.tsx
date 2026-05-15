import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type SagaContextValue = {
  energyPoints: number;
  setEnergyPoints: (points: number) => void;
};

const SagaContext = createContext<SagaContextValue | null>(null);

export function SagaProvider({ children }: { children: ReactNode }) {
  const [energyPoints, setEnergyPoints] = useState(0);

  const value = useMemo(
    () => ({ energyPoints, setEnergyPoints }),
    [energyPoints],
  );

  return <SagaContext.Provider value={value}>{children}</SagaContext.Provider>;
}

export function useSaga() {
  const ctx = useContext(SagaContext);
  if (!ctx) throw new Error('useSaga must be used within SagaProvider');
  return ctx;
}
