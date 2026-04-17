import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch profile from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        } else {
          // Profile Sync: Create profile if it doesn't exist
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
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
