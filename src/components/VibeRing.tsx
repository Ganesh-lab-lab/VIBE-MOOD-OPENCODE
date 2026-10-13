import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Zap, Flame, Activity, Heart, CloudRain, Car, Leaf, RotateCcw } from "lucide-react";

const MOODS = [
  { id: "chill", icon: Leaf, label: "Chill" },
  { id: "focus", icon: Zap, label: "Focus" },
  { id: "party", icon: Flame, label: "Party" },
  { id: "workout", icon: Activity, label: "Workout" },
  { id: "romantic", icon: Heart, label: "Romantic" },
  { id: "sad", icon: CloudRain, label: "Sad" },
  { id: "roadtrip", icon: Car, label: "Road trip" },
  { id: "reset", icon: RotateCcw, label: "Reset" },
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
    theme.setMode(id as any);
    setOpen(false);
  };
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {open && MOODS.map((m, i) => {
        const angle = (i / MOODS.length) * Math.PI * 2 - Math.PI / 2;
        const r = size * 1.95;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const Icon = m.icon;
        return (
          <button key={m.id} aria-label={m.label} onClick={(e) => choose(m.id, e)} className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform" style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, zIndex: 40 }}>
            <Icon size={16} strokeWidth={1.75} />
          </button>
        );
      })}
      <button aria-label="Vibe selector" onClick={toggle} className="w-full h-full rounded-full glass flex items-center justify-center" style={{ boxShadow: "0 0 24px var(--primary)" }}>
        <span className="font-display font-bold text-[10px]">vibe</span>
      </button>
    </div>
  );
}