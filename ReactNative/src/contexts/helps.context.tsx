import React, { createContext, useContext, ReactNode } from 'react';
import { useHelpsInternal, type UseHelpsHook } from '@/hooks/useHelps';

type API = Pick<UseHelpsHook, 'openHelpsModal'>;
const HelpsContext = createContext<API | null>(null);

export function HelpsProvider({ children }: { children: ReactNode }) {
  const store = useHelpsInternal();

  const value = React.useMemo<API>(
    () => ({
      openHelpsModal: store.openHelpsModal,
    }),
    [store.openHelpsModal],
  );

  return (
    <HelpsContext.Provider value={value}>
      {children}
      {store.renderHelpsModal()}
    </HelpsContext.Provider>
  );
}

export function useHelps() {
  const ctx = useContext(HelpsContext);
  if (!ctx) throw new Error('useHelps must be used within <HelpsProvider>');
  return ctx;
}
