import React, { createContext, useContext, useEffect, useState } from "react";

interface User { name: string; email: string; languages: string[]; }
interface AuthCtx {
  user: User | null;
  loggedIn: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  setName: (n: string) => void;
  setLanguages: (langs: string[]) => void;
}

const C = createContext<AuthCtx | null>(null);

function validEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { const raw = localStorage.getItem("vibemood_user"); const u = raw ? JSON.parse(raw) : null; if (u && !u.languages) u.languages = JSON.parse(localStorage.getItem("vibemood_languages") || "[]"); return u; } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("vibemood_user", JSON.stringify(user));
    else localStorage.removeItem("vibemood_user");
  }, [user]);

  const login = (email: string, password: string) => {
    if (!email || !password) return { ok: false, error: "Please fill in all fields." };
    if (!validEmail(email)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 6) return { ok: false, error: "Wrong password. Try at least 6 characters." };
    const name = localStorage.getItem("vibemood_signup_name") || email.split("@")[0];
    const languages = JSON.parse(localStorage.getItem("vibemood_languages") || '["en"]');
    setUser({ name, email, languages });
    return { ok: true };
  };
  const signup = (name: string, email: string, password: string) => {
    if (!name || !email || !password) return { ok: false, error: "Please fill in all fields." };
    if (!validEmail(email)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    localStorage.setItem("vibemood_signup_name", name);
    const languages = JSON.parse(localStorage.getItem("vibemood_languages") || '["en"]');
    setUser({ name, email, languages });
    return { ok: true };
  };
  const setLanguages = (langs: string[]) => {
    setUser((u) => (u ? { ...u, languages: langs } : u));
    localStorage.setItem("vibemood_languages", JSON.stringify(langs));
  };

  const logout = () => { setUser(null); };

  const setName = (n: string) => setUser((u) => (u ? { ...u, name: n } : u));

  return <C.Provider value={{ user, loggedIn: !!user, login, signup, logout, setName, setLanguages }}>{children}</C.Provider>;
}

export function useAuth() {
  const c = useContext(C);
  if (!c) throw new Error("useAuth outside");
  return c;
}
