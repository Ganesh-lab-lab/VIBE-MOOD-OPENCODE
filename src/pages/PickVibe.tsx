import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { artists } from "../data/artists";
import { Logo } from "../components/Logo";

const GENRES = ["Pop","Electronic","Indie","Acoustic","Hip-Hop","Jazz","Rock","Lo-Fi","Ambient","R&B","Folk","Synthwave"];

export function PickVibe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (id: string) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : (p.length >= 8 ? p : [...p, id])));
  };
  const bubbles = [...GENRES.map((g) => ({ id: "g:" + g, label: g })), ...artists.map((a) => ({ id: "a:" + a.id, label: a.name }))];
  return (
    <div className="min-h-screen flex flex-col items-center p-6 gap-6">
      <div className="mt-8 text-center">
        <Logo size={40} showWordmark />
        <h1 className="font-display text-3xl font-bold mt-4">Pick your vibe</h1>
        <p className="text-muted mt-1">Choose at least 3 genres or artists you love.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
        {bubbles.map((b) => {
          const active = picked.includes(b.id);
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              className={"px-4 py-2 rounded-full glass transition-transform " + (active ? "scale-105" : "")}
              style={{ borderColor: active ? "var(--primary)" : undefined }}
              aria-pressed={active}
            >
              <span className="glass-inner font-medium text-sm">{b.label}</span>
            </button>
          );
        })}
      </div>
      <div className="text-sm text-muted">{picked.length} chosen</div>
      <button
        disabled={picked.length < 3}
        onClick={() => navigate("/welcome")}
        className="px-8 h-11 rounded-full bg-primary text-white font-semibold disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
