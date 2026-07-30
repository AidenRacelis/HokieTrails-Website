"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isSavedTrail: (id: string) => boolean;
  isSavedHousing: (id: string) => boolean;
  toggleSavedTrail: (id: string) => Promise<void>;
  toggleSavedHousing: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await api.register({ username, email, password });
      setToken(res.token);
      setUser(res.user);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const isSavedTrail = useCallback(
    (id: string) => !!user?.saved_trails?.includes(id),
    [user],
  );
  const isSavedHousing = useCallback(
    (id: string) => !!user?.saved_housing?.includes(id),
    [user],
  );

  const toggleSavedTrail = useCallback(
    async (id: string) => {
      if (!user) return;
      const saved = user.saved_trails.includes(id);
      const res = saved ? await api.unsaveTrail(id) : await api.saveTrail(id);
      setUser({ ...user, saved_trails: res.saved_trails });
    },
    [user],
  );

  const toggleSavedHousing = useCallback(
    async (id: string) => {
      if (!user) return;
      const saved = user.saved_housing.includes(id);
      const res = saved ? await api.unsaveHousing(id) : await api.saveHousing(id);
      setUser({ ...user, saved_housing: res.saved_housing });
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isSavedTrail,
      isSavedHousing,
      toggleSavedTrail,
      toggleSavedHousing,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      isSavedTrail,
      isSavedHousing,
      toggleSavedTrail,
      toggleSavedHousing,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
