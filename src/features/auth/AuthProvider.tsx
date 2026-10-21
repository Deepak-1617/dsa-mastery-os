import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Profile } from "../../types/models";
import { isSupabaseConfigured } from "../../lib/env";
import { currentProfile, currentUser, logout as storeLogout } from "../../store/api";
import { restoreSupabaseSession } from "../../store/cloudAuth";
import { installCloudSync, pullCloudWorkspace } from "../../store/cloudSync";
import { hydrateFromIdb, storeGeneration, subscribe } from "../../store/db";

installCloudSync();

interface AuthContextValue {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const generation = useSyncExternalStore(subscribe, storeGeneration, storeGeneration);
  const [loading, setLoading] = useState(true);
  const user = currentUser();
  const profile = currentProfile();
  const sessionUserId = user?.id ?? null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrateFromIdb();
      if (isSupabaseConfigured()) {
        try {
          await restoreSupabaseSession();
          await pullCloudWorkspace();
        } catch {
          /* stay signed out if restore fails */
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      userId: sessionUserId,
      email: user?.email ?? null,
      profile,
      loading,
      signOut: storeLogout,
    }),
    [sessionUserId, user?.email, profile, loading, generation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
