import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface LikesCtx {
  liked: Set<string>;
  isLiked: (id: string) => boolean;
  toggle: (id: string) => void;
}

const Ctx = createContext<LikesCtx | null>(null);

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("vibemood_liked") || "[]")); }
    catch { return new Set(); }
  });
  useEffect(() => {
    localStorage.setItem("vibemood_liked", JSON.stringify([...liked]));
  }, [liked]);
  const isLiked = useCallback((id: string) => liked.has(id), [liked]);
  const toggle = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);
  return <Ctx.Provider value={{ liked, isLiked, toggle }}>{children}</Ctx.Provider>;
}

export function useLikes() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLikes outside provider");
  return c;
}
