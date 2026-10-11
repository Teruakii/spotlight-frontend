"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser, getMe, getMyProfile } from "@/lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "spotlight_token";

// /users/me carries identity and permissions; /users/me/profile adds the
// editable profile fields (avatar, bio, ...). The navbar needs both.
async function loadUser(token) {
  const [me, profile] = await Promise.all([getMe(token), getMyProfile(token).catch(() => null)]);
  return profile ? { ...profile, ...me } : me;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    loadUser(stored)
      .then((me) => {
        setToken(stored);
        setUser(me);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { token: newToken } = await loginUser(credentials);
    const me = await loadUser(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(me);
    return me;
  }, []);

  const register = useCallback((input) => registerUser(input), []);

  const applyProfile = useCallback((profile) => {
    setUser((current) => (current ? { ...current, ...profile, permissions: current.permissions } : current));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => {
    const permissions = user?.permissions ?? [];
    return {
      token,
      user,
      loading,
      isAdmin: user?.role === "admin",
      hasPermission: (name) => permissions.includes(name),
      login,
      register,
      logout,
      applyProfile,
    };
  }, [token, user, loading, login, register, logout, applyProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
