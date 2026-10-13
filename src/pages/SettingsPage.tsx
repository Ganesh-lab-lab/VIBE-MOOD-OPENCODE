import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import { LANGUAGES } from "../lib/languages";

const VIBE_OPTIONS = [
  { id: "auto", label: "Auto" },
  { id: "chill", label: "Chill" },
  { id: "focus", label: "Focus" },
  { id: "party", label: "Party" },
  { id: "workout", label: "Workout" },
  { id: "romantic", label: "Romantic" },
  { id: "sad", label: "Sad" },
  { id: "roadtrip", label: "Road trip" },
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "night", label: "Night" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, setName, logout, setLanguages } = useAuth();

  const [name, setNameLocal] = useState(user?.name || "");
  const [langs, setLangs] = useState<string[]>(user?.languages || ["en"]);
  const toggleLang = (code: string) => setLangs((p) => (p.includes(code) ? p.filter((c) => c !== code) : [...p, code]));
  const [quality, setQuality] = useState("High");
  const [notif, setNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  useEffect(() => { if (langs.length) setLanguages(langs); }, [langs]);

  const saveName = () => { if (name.trim()) setName(name.trim()); };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <div className="glass p-6">
        <div className="glass-inner space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-2 text-on-primary flex items-center justify-center font-display font-bold text-2xl">{user?.name?.[0]?.toUpperCase() || "V"}</div>
            <div className="flex-1">
              <div className="text-xs text-muted">Name</div>
              <input value={name} onChange={(e) => setNameLocal(e.target.value)} onBlur={saveName} className="w-full mt-1 h-10 px-3 rounded-xl bg-surface/40" />
              <div className="text-xs text-muted mt-1">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <div className="glass-inner space-y-3">
          <h2 className="font-display text-xl font-bold">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => toggleLang(l.code)} className={"px-3 py-1.5 rounded-full text-xs " + (langs.includes(l.code) ? "bg-gradient-to-r from-primary to-primary-2 text-on-primary" : "bg-surface/50 text-muted")}>
                {l.nativeName} <span className="opacity-70">({l.name})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <div className="glass-inner space-y-3">
          <h2 className="font-display text-xl font-bold">Audio quality</h2>
          <div className="flex gap-2">
            {["Low","Normal","High","Lossless"].map((q) => (
              <button key={q} onClick={() => setQuality(q)} className={"px-4 py-1.5 rounded-full text-sm " + (quality === q ? "bg-gradient-to-r from-primary to-primary-2 text-on-primary" : "bg-surface/50 text-muted")}>{q}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <div className="glass-inner space-y-3">
          <h2 className="font-display text-xl font-bold">Notifications</h2>
          <label className="flex items-center justify-between">
            <span>Push notifications</span>
            <input type="checkbox" checked={notif} onChange={(e) => setNotif(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between">
            <span>Email updates</span>
            <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
          </label>
        </div>
      </div>

      <div className="glass p-6">
        <div className="glass-inner space-y-2 text-xs text-muted">
          <h2 className="font-display text-xl font-bold text-text">About</h2>
          <p>Data: iTunes Search API (Apple) and Deezer. Full-song playback via official YouTube IFrame Player API. Channel RSS feeds for new releases.</p>
          <p>No audio downloaded or proxied. All previews from metadata APIs.</p>
        </div>
      </div>

      <button onClick={() => { logout(); navigate("/splash"); }} className="flex items-center gap-2 text-secondary font-semibold">
        <LogOut size={18} strokeWidth={1.75} /> Log out
      </button>

      <div className="pt-6 border-t border-white/10 flex items-center gap-3">
        <Logo size={24} showWordmark />
        <span className="text-xs text-muted">v1.0.0</span>
      </div>
    </div>
  );
}
