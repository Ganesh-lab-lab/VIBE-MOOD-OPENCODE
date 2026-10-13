import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeBucket = "night" | "morning" | "afternoon";
export type Vibe =
  | "auto"
  | "chill"
  | "focus"
  | "party"
  | "workout"
  | "romantic"
  | "sad"
  | "roadtrip";

const VIBES: Vibe[] = ["chill", "focus", "party", "workout", "romantic", "sad", "roadtrip"];

function bucketFromHour(h: number): ThemeBucket {
  if (h >= 5 && h <= 11) return "morning";
  if (h >= 12 && h <= 17) return "afternoon";
  return "night";
}

interface ThemeCtx {
  mode: Vibe;
  setMode: (m: Vibe) => void;
  forcedHour: number | null;
  setForcedHour: (h: number | null) => void;
  effectiveHour: number;
  bucket: ThemeBucket;
  debugOpen: boolean;
  setDebugOpen: (b: boolean) => void;
  toggleDebug: () => void;
  isVibe: boolean;
  ripple: (x: number, y: number) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Vibe>(() => {
    const m = localStorage.getItem("vibemood_mode") as Vibe | null;
    return m && (m === "auto" || VIBES.includes(m as any)) ? m : "auto";
  });
  const [forcedHour, setForcedHourState] = useState<number | null>(null);
  const [clockHour, setClockHour] = useState(new Date().getHours());
  const [debugOpen, setDebugOpen] = useState(false);
  const [ripplePt, setRipplePt] = useState<{ x: number; y: number } | null>(null);

  // clock tick every minute
  useEffect(() => {
    const t = setInterval(() => setClockHour(new Date().getHours()), 60000);
    return () => clearInterval(t);
  }, []);

  const effectiveHour = forcedHour !== null ? forcedHour : clockHour;
  const bucket = bucketFromHour(effectiveHour);

  // apply data attributes
  useEffect(() => {
    const html = document.documentElement;
    if (mode === "auto") {
      html.removeAttribute("data-vibe");
      html.setAttribute("data-theme", bucket);
      document.body.style.colorScheme = bucket === "night" ? "dark" : "light";
    } else {
      html.setAttribute("data-vibe", mode);
      // base theme bucket still set for fallback variables not overridden? vibe sets all, but keep data-theme too
      html.setAttribute("data-theme", bucket === "night" ? "night" : bucket);
    }
  }, [mode, bucket]);

  const setMode = useCallback((m: Vibe) => {
    setModeState(m);
    localStorage.setItem("vibemood_mode", m);
  }, []);

  const setForcedHour = useCallback((h: number | null) => setForcedHourState(h), []);

  const toggleDebug = useCallback(() => setDebugOpen((d) => !d), []);

  // keyboard shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        setDebugOpen((d) => !d);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const ripple = useCallback((x: number, y: number) => {
    setRipplePt({ x, y });
    window.setTimeout(() => setRipplePt(null), 700);
  }, []);

  const value: ThemeCtx = {
    mode,
    setMode,
    forcedHour,
    setForcedHour,
    effectiveHour,
    bucket,
    debugOpen,
    setDebugOpen,
    toggleDebug,
    isVibe: mode !== "auto",
    ripple,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {ripplePt && (
        <div
          className="pointer-events-none fixed z-[9999] rounded-full"
          style={{
            left: ripplePt.x - 20,
            top: ripplePt.y - 20,
            width: 40,
            height: 40,
            background: "var(--primary)",
            opacity: 0.35,
            transform: "scale(1)",
            animation: "rippleExpand 0.7s ease-out forwards",
          }}
        />
      )}
      <style>{`
        @keyframes rippleExpand { 0% { transform: scale(1); opacity: 0.45; } 100% { transform: scale(60); opacity: 0; } }
      `}</style>
    </Ctx.Provider>
  );
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme outside provider");
  return c;
}

export { VIBES };
