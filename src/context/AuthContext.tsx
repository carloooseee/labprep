import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'patient';
  displayName?: string;
  hospitalId?: string;
  preferredLanguage?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine role based on email if profile doesn't exist
  const getInitialRole = (email: string): 'admin' | 'patient' => {
    const adminEmails = ['admin@hospital.com'];
    return adminEmails.includes(email.toLowerCase()) ? 'admin' : 'patient';
  };

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Clear previous profile listener if it exists
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (currentUser) {
        // Fetch/Listen to profile from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        
        profileUnsubscribe = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            setProfile(userSnap.data() as UserProfile);
          } else {
            // Profile Sync: Create profile if it doesn't exist (one-time check)
            console.log("No profile found for UID", currentUser.uid, ". Syncing based on email...");
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              role: getInitialRole(currentUser.email || ''),
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              hospitalId: 'h1', // Default for now
              preferredLanguage: 'en'
            };
            
            await setDoc(userRef, newProfile);
            // setProfile is not needed here as onSnapshot will trigger again
          }
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut: handleSignOut 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
