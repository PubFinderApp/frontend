"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/entities/user/model/types";
import { getStoredAuthSession } from "@/shared/lib/auth-storage";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedUser = getStoredAuthSession();
      setUser(storedUser);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load auth session.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    void refreshRef.current();
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, error, refresh, setUser }),
    [user, isLoading, error, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};
