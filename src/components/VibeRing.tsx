import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Zap, Flame, Activity, Heart, CloudRain, Car, Leaf } from "lucide-react";

const MOODS: { id: string; icon: any; label: string }[] = [
  { id: "chill", icon: Leaf, label: "Chill" },
  { id: "focus", icon: Zap, label: "Focus" },
  { id: "party", icon: Flame, label: "Party" },
  { id: "workout", icon: Activity, label: "Workout" },
  { id: "romantic", icon: Heart, label: "Romantic" },
  { id: "sad", icon: CloudRain, label: "Sad" },
  { id: "roadtrip", icon: Car, label: "Road trip" },
];

export default function VibeRing({ size = 56 }: { size?: number }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const toggle = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    theme.ripple(r.left + r.width / 2, r.top + r.height / 2);
    setOpen((o) => !o);
  };
  const choose = (id: string, e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    theme.ripple(r.left + r.width / 2, r.top + r.height / 2);
    // view transition if available
    const anyDoc = document as any;
    if (anyDoc.startViewTransition) {
      try { anyDoc.startViewTransition(() => theme.setMode(id as any)); } catch { theme.setMode(id as any); }
    } else {
      theme.setMode(id as any);
    }
    setOpen(false);
  };
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {open && MOODS.map((m, i) => {
        const angle = (i / MOODS.length) * Math.PI * 2 - Math.PI / 2;
        const r = size * 1.9;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            aria-label={m.label}
            onClick={(e) => choose(m.id, e)}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, zIndex: 40 }}
          >
            <Icon size={18} strokeWidth={1.75} />
          </button>
        );
      })}
      <button
        aria-label="Vibe selector"
        onClick={toggle}
        className="w-full h-full rounded-full glass flex items-center justify-center relative overflow-hidden"
        style={{ boxShadow: "0 0 24px var(--primary)" }}
      >
        <div className="glass-inner flex items-center justify-center">
          <span className="font-display font-bold text-xs">vibe</span>
        </div>
      </button>
    </div>
  );
}
