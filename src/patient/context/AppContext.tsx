import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, where, doc, limit } from 'firebase/firestore';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  contact?: string;
  status: string;
  location?: { _lat: number; _long: number };
}

export interface TestGuide {
  id: string;
  name: string;
  category: string;
  description: string;
  fastingRequirement?: string;
  imageUrl?: string;
  defaultInstructions?: string;
  preparations: any[];
  guidelines: any;
  translations?: any;
  hospitalId?: string;
  status?: string;
}

export interface Stat {
  hospitalId: string;
  totalPatients: number;
  testsCompleted: number;
  notificationsSent: number;
}

export interface Activity {
  id: string;
  hospitalId: string;
  user: string;
  action: string;
  timestamp: any;
}

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  recipients: string;
  date: string;
  status: string;
}

interface AppContextType {
  selectedHospitalId: string | null;
  setSelectedHospitalId: (id: string | null) => void;
  hospitals: Hospital[];
  testGuides: TestGuide[];
  stats: Stat | null;
  activity: Activity[];
  broadcasts: Broadcast[];
  loading: boolean;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [globalTestGuides, setGlobalTestGuides] = useState<TestGuide[]>([]);
  const [testGuides, setTestGuides] = useState<TestGuide[]>([]);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [stats, setStats] = useState<Stat | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper for deep merging overrides (simple version for the schema)
  const mergeOverrides = (guide: TestGuide, overrideObj: any) => {
    if (!overrideObj) return guide;
    const merged = { ...guide, ...overrideObj };
    // Handle nested structures if they exist in overrides (e.g., guidelines)
    if (guide.guidelines && overrideObj.guidelines) {
      merged.guidelines = { ...guide.guidelines, ...overrideObj.guidelines };
    }
    return merged;
  };

  useEffect(() => {
    // 1. Listen to Hospitals
    const hospitalsUnsubscribe = onSnapshot(collection(db, 'hospitals'), (snapshot) => {
      const hospitalData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hospital));
      setHospitals(hospitalData);
      
      if (!selectedHospitalId && hospitalData.length > 0) {
        setSelectedHospitalId(hospitalData[0].id);
      }
      setLoading(false);
    });

    // 2. Listen to Global Test Guides
    const guidesUnsubscribe = onSnapshot(query(collection(db, 'testGuides'), orderBy('name')), (snapshot) => {
      const guideData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestGuide));
      setGlobalTestGuides(guideData);
    });

    // 2.5 Listen to Broadcasts
    const broadcastsUnsubscribe = onSnapshot(query(collection(db, 'broadcasts'), orderBy('date', 'desc')), (snapshot) => {
      const broadcastData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Broadcast));
      setBroadcasts(broadcastData);
    });

    return () => {
      hospitalsUnsubscribe();
      guidesUnsubscribe();
      broadcastsUnsubscribe();
    }
  }, []);

  // 3. Listen to Overrides for selected hospital
  useEffect(() => {
    if (!selectedHospitalId) return;

    const overridesQuery = query(
      collection(db, 'hospitalOverrides'), 
      where('hospitalId', '==', selectedHospitalId)
    );

    const overridesUnsubscribe = onSnapshot(overridesQuery, (snapshot) => {
      const overrideData = snapshot.docs.map(doc => doc.data());
      setOverrides(overrideData);
    });

    return () => overridesUnsubscribe();
  }, [selectedHospitalId]);

  // 4. Merge Global Guides with Overrides
  useEffect(() => {
    const mergedGuides = globalTestGuides.map(guide => {
      const override = overrides.find(o => o.testGuideId === guide.id);
      return mergeOverrides(guide, override?.overrides);
    });
    setTestGuides(mergedGuides);
  }, [globalTestGuides, overrides]);

  // 5. Listen to Stats for selected hospital
  useEffect(() => {
    if (!selectedHospitalId) return;

    const statsRef = doc(db, 'stats', selectedHospitalId);
    const statsUnsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setStats(doc.data() as Stat);
      } else {
        setStats(null);
      }
    });

    return () => statsUnsubscribe();
  }, [selectedHospitalId]);

  // 6. Listen to Activity for selected hospital
  useEffect(() => {
    if (!selectedHospitalId) return;

    const activityQuery = query(
      collection(db, 'activity'),
      where('hospitalId', '==', selectedHospitalId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const activityUnsubscribe = onSnapshot(activityQuery, (snapshot) => {
      const activityData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Activity));
      setActivity(activityData);
    });

    return () => activityUnsubscribe();
  }, [selectedHospitalId]);

  return (
    <AppContext.Provider value={{ 
      selectedHospitalId, 
      setSelectedHospitalId, 
      hospitals, 
      testGuides,
      stats,
      activity,
      broadcasts,
      loading 
    }}>
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
