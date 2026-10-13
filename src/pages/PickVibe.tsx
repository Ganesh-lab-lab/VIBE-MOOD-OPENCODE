import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES } from "../lib/languages";

export function PickVibe() {
  const navigate = useNavigate();
  const { setLanguages } = useAuth();
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (code: string) => {
    setPicked((p) => (p.includes(code) ? p.filter((x) => x !== code) : [...p, code]));
  };
  const save = () => {
    const langs = picked.length ? picked : ["en"];
    setLanguages(langs);
    localStorage.setItem("vibemood_languages", JSON.stringify(langs));
    navigate("/welcome");
  };
  return (
    <div className="min-h-screen flex flex-col items-center p-6 gap-6">
      <h1 className="font-display text-3xl font-bold mt-8">Pick your languages</h1>
      <p className="text-muted">Choose one or more. Order of selection becomes priority.</p>
      <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
        {LANGUAGES.map((l) => {
          const active = picked.includes(l.code);
          const order = picked.indexOf(l.code) + 1;
          return (
            <button key={l.code} onClick={() => toggle(l.code)} className={"glass p-5 rounded-3xl text-center min-w-[120px] transition-transform " + (active ? "scale-105" : "")} style={{ borderColor: active ? "var(--primary)" : undefined }}>
              <div className="glass-inner">
                <div className="font-display text-2xl font-bold" style={{ color: `var(${l.colorVar})` }}>{l.nativeName}</div>
                <div className="text-xs text-muted mt-1">{l.name}</div>
                <div className="text-[10px] text-muted">{l.industryLabel}</div>
                {active && <div className="mt-1 text-xs text-primary">#{order}</div>}
              </div>
            </button>
          );
        })}
      </div>
      <button disabled={picked.length === 0} onClick={save} className="px-8 h-11 rounded-full bg-gradient-to-r from-primary to-primary-2 text-on-primary font-semibold disabled:opacity-40">
        Continue
      </button>
    </div>
  );
}
