import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { firebaseAuth } from "@/integrations/firebase/client";
import { syncUserSession, type SessionUser } from "@/lib/api";

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: SessionUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SessionUser>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadSession(user: User): Promise<SessionUser> {
  const idToken = await user.getIdToken();
  return syncUserSession(idToken);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setAppUser(null);
        setLoading(false);
        return;
      }

      try {
        const sessionUser = await loadSession(user);
        setAppUser(sessionUser);
      } catch (error) {
        console.error("Failed to restore user session:", error);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      appUser,
      loading,
      async signIn(email: string, password: string) {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const sessionUser = await loadSession(credential.user);
        setFirebaseUser(credential.user);
        setAppUser(sessionUser);
        return sessionUser;
      },
      async signOutUser() {
        await signOut(firebaseAuth);
        setFirebaseUser(null);
        setAppUser(null);
      },
    }),
    [appUser, firebaseUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
