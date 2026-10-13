import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Vibe = "default" | "chill" | "focus" | "party" | "workout" | "romantic" | "sad" | "roadtrip" | "reset";

const MOODS: Record<string, { primary: string; sky: [string,string,string,string] }> = {
  chill: { primary: "#2DD4BF", sky: ["#14b8a6","#22c55e","#5eead4","#34d399"] },
  focus: { primary: "#38BDF8", sky: ["#0ea5e9","#6366f1","#38bdf8","#818cf8"] },
  party: { primary: "#FF3EA5", sky: ["#ff3ea5","#e879f9","#f472b6","#c084fc"] },
  workout: { primary: "#D42E0B", sky: ["#ef4444","#f97316","#fb7185","#fca5a5"] },
  romantic: { primary: "#C2185B", sky: ["#ec4899","#f43f5e","#fda4af","#fb7185"] },
  sad: { primary: "#8FB4FF", sky: ["#4f6fd8","#6366f1","#94a3b8","#cbd5e1"] },
  roadtrip: { primary: "#FF8A3D", sky: ["#ff8a3d","#fbbf24","#fb7185","#a78bfa"] },
};
const DEFAULT = { primary: "#9B5CFF", sky: ["#8B6BE0","#4F6FD8","#C06AB8","#6D8CF0"] as [string,string,string,string] };

interface ThemeCtx { mode: Vibe; setMode: (m: Vibe) => void; ripple: (x:number,y:number)=>void; }
const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Vibe>(() => {
    const m = localStorage.getItem("vibemood_vibe") as Vibe | null;
    return m && (m === "default" || MOODS[m]) ? m : "default";
  });
  const [ripplePt, setRipplePt] = useState<{x:number;y:number}|null>(null);

  const apply = useCallback((m: Vibe) => {
    const chosen = m === "reset" || m === "default" ? DEFAULT : (MOODS[m] || DEFAULT);
    const root = document.documentElement;
    root.style.setProperty("--primary", chosen.primary);
    root.style.setProperty("--sky-1", chosen.sky[0]);
    root.style.setProperty("--sky-2", chosen.sky[1]);
    root.style.setProperty("--sky-3", chosen.sky[2]);
    root.style.setProperty("--sky-4", chosen.sky[3]);
    if (m === "party") root.style.setProperty("--primary-glow","rgba(255,62,165,0.4)");
  }, []);

  useEffect(() => { apply(mode); }, [mode, apply]);

  const setMode = useCallback((m: Vibe) => {
    const next = m === "reset" ? "default" : m;
    setModeState(next);
    localStorage.setItem("vibemood_vibe", next);
    apply(next);
  }, [apply]);

  const ripple = useCallback((x:number,y:number) => { setRipplePt({x,y}); window.setTimeout(()=>setRipplePt(null),700); }, []);

  return (
    <Ctx.Provider value={{ mode, setMode, ripple }}>
      {children}
      {ripplePt && <div className="pointer-events-none fixed z-[9999] rounded-full" style={{ left: ripplePt.x-20, top: ripplePt.y-20, width:40, height:40, background:"var(--primary)", opacity:0.35, transform:"scale(1)", animation:"rippleExpand 0.7s ease-out forwards" }} />}
      <style>{`@keyframes rippleExpand {0%{transform:scale(1);opacity:.45}100%{transform:scale(60);opacity:0}}`}</style>
    </Ctx.Provider>
  );
}

export function useTheme() { const c = useContext(Ctx); if (!c) throw new Error("useTheme outside"); return c; }