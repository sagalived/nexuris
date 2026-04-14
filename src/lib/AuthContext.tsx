import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, OperationType, handleFirestoreError } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'lawyer' | 'user';
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isLawyer: boolean;
  isDemoMode: boolean;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isLawyer: false,
  isDemoMode: false,
  loginAsDemo: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode in localStorage
    const demo = localStorage.getItem('nexuris_demo_mode') === 'true';
    if (demo) {
      setIsDemoMode(true);
      setProfile({
        uid: 'demo-admin',
        email: 'admin@nexuris.com',
        displayName: 'Administrador (Demo)',
        photoURL: null,
        role: 'admin',
        createdAt: new Date(),
      });
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to profile changes
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create profile if it doesn't exist
            const isDefaultAdmin = firebaseUser.email === 'admin@nexuris.com';
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || (isDefaultAdmin ? 'Administrador' : ''),
              photoURL: firebaseUser.photoURL,
              role: isDefaultAdmin ? 'admin' : 'user', // Default admin role for the specific email
              createdAt: serverTimestamp(),
            };
            setDoc(userDocRef, newProfile).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`));
          }
          setLoading(false);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loginAsDemo = () => {
    localStorage.setItem('nexuris_demo_mode', 'true');
    setIsDemoMode(true);
    setProfile({
      uid: 'demo-admin',
      email: 'admin@nexuris.com',
      displayName: 'Administrador (Demo)',
      photoURL: null,
      role: 'admin',
      createdAt: new Date(),
    });
  };

  const logout = async () => {
    localStorage.removeItem('nexuris_demo_mode');
    setIsDemoMode(false);
    setProfile(null);
    setUser(null);
    await auth.signOut();
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin' || isDemoMode,
    isLawyer: profile?.role === 'lawyer',
    isDemoMode,
    loginAsDemo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
