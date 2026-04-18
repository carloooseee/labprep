import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, where, doc, limit } from 'firebase/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface Hospital {
  id: string;
  name: string;
  procedureName?: string;
  address: string;
  contactNumber?: string;
  contact?: string; // Keep for compatibility if needed
  status: string;
  location?: string;
}

export interface TestGuide {
  id: string;
  name?: string;
  procedureName: string; // Renamed from name
  category: string;
  description: string;
  fastingRequired?: string; // Renamed from fastingRequirement
  duration?: number;
  imageUrl?: string;
  defaultInstructions?: string;
  preparationSteps: any[]; // Renamed from preparations
  guidelines: any;
  translations?: any;
  hospital?: string; // Renamed from hospitalId
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
  globalTestGuides: TestGuide[];
  patients: any[];
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
  const [patients, setPatients] = useState<any[]>([]);
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
    // We remove the Firestore orderBy to prevent query failures on documents missing the field.
    // We sort in memory and normalize the data structure for backwards compatibility.
    const guidesUnsubscribe = onSnapshot(collection(db, 'testGuides'), (snapshot) => {
      const guideData = snapshot.docs.map(snap => {
        const data = snap.data() as any;
        
        // Deep normalization for translations
        const normalizedTranslations = { ...data.translations };
        if (normalizedTranslations.tl) {
          normalizedTranslations.tl = {
            ...normalizedTranslations.tl,
            procedureName: normalizedTranslations.tl.procedureName || normalizedTranslations.tl.name || data.procedureName || data.name || '',
            description: normalizedTranslations.tl.description || data.description || '',
            preparationSteps: normalizedTranslations.tl.preparationSteps || normalizedTranslations.tl.preparations || [],
            guidelines: normalizedTranslations.tl.guidelines || data.guidelines || { dos: [], donts: [] }
          };
        }

        return {
          id: snap.id,
          // Normalization logic: Fallback to old keys if new ones are missing
          procedureName: data.procedureName || data.name || 'Unnamed Procedure',
          category: data.category || 'Other',
          description: data.description || '',
          fastingRequired: data.fastingRequired || data.fastingRequirement || '',
          duration: data.duration || 15,
          preparationSteps: data.preparationSteps || data.preparations || [],
          hospital: data.hospital || data.hospitalId || '',
          status: data.status || 'Active',
          imageUrl: data.imageUrl || '',
          guidelines: data.guidelines || { dos: [], donts: [] },
          translations: normalizedTranslations
        } as TestGuide;
      }).sort((a, b) => a.procedureName.localeCompare(b.procedureName));
      
      setGlobalTestGuides(guideData);
    });

    // 2.5 Listen to Broadcasts
    let isInitialBroadcastLoad = true;
    const broadcastsUnsubscribe = onSnapshot(query(collection(db, 'broadcasts'), orderBy('date', 'desc')), (snapshot) => {
      const broadcastData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Broadcast));
      setBroadcasts(broadcastData);

      if (!isInitialBroadcastLoad) {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data() as Broadcast;
            LocalNotifications.schedule({
              notifications: [
                {
                  title: `📢 ${data.title || 'New Announcement'}`,
                  body: data.message || 'You have a new broadcast message.',
                  id: Math.floor(Math.random() * 1000000),
                  channelId: 'reminders',
                  smallIcon: 'ic_stat_name'
                }
              ]
            }).catch(e => console.error('Local Notification auto-trigger error:', e));
          }
        });
      }
      isInitialBroadcastLoad = false;
    });

    // 2.6 Listen to Users (Patients)
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const patientsOnly = userData.filter((u: any) => u.role === 'patient');
      setPatients(patientsOnly);
    });

    return () => {
      hospitalsUnsubscribe();
      guidesUnsubscribe();
      broadcastsUnsubscribe();
      usersUnsubscribe();
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
      globalTestGuides,
      patients,
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
