import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { hospitalsCollection } from '../data/Procedures';

interface AppContextType {
  selectedHospitalId: string | null;
  setSelectedHospitalId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(hospitalsCollection[0]?.id || null);

  return (
    <AppContext.Provider value={{ selectedHospitalId, setSelectedHospitalId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
