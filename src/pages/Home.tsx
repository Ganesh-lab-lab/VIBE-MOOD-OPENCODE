import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Play, Search, ChevronRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { songs, artistById } from "../data/songs";
import { artists } from "../data/artists";
import { LANGUAGES } from "../lib/languages";
import { greetings } from "../lib/languages";
import Cover from "../components/Cover";
import { apiNew } from "../lib/api";

export default function Home() {
  const { mode } = useTheme();
  const navigate = useNavigate();
  const player = usePlayer();
  const { user } = useAuth();
  const userLangs = (user as any)?.languages || ["en"];
  const orderedLangs = [...userLangs, ...LANGUAGES.map((l) => l.code).filter((c) => !userLangs.includes(c))];
  const [chip, setChip] = useState("All");
  const [lang, setLang] = useState("");
  const [releaseSongs, setReleaseSongs] = useState<any[]>(() => songs.filter((s) => s.isNew));
  const [toast, setToast] = useState("");
  const effectiveHour = new Date().getHours();

  useEffect(() => {
    apiNew(lang || undefined).then((r) => { if (r?.songs?.length) setReleaseSongs(r.songs); }).catch(() => {});
  }, [lang]);

  const vibe = mode === "default" ? null : mode;
  const filteredSongs = useMemo(() => songs.filter((s) => !vibe || (s.vibeTags || []).includes(vibe)), [vibe]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">Vibemood</h1>
        <button aria-label="Search" onClick={() => navigate("/search")} className="w-10 h-10 rounded-full glass flex items-center justify-center"><Search size={18} strokeWidth={1.75} /></button>
      </div>

      {user?.languages?.[0] && greetings[user.languages[0]] && <div className="text-xs text-muted">{greetings[user.languages[0]]}</div>}

      {toast && <div className="fixed top-4 right-4 z-50 glass px-4 py-2 text-sm text-primary">{toast}</div>}

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setLang("")} className={"px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap " + (!lang ? "bg-gradient-to-r from-primary to-primary-2 text-on-primary" : "glass")}>All</button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap glass">Music</button>
        {orderedLangs.map((c) => { const l = LANGUAGES.find((x) => x.code === c)!; return (
          <button key={c} onClick={() => setLang(c)} className={"px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap " + (lang === c ? "bg-gradient-to-r from-primary to-primary-2 text-on-primary" : "glass")}>{l.nativeName}</button>
        );})}
      </div>

      <section>
        <h2 className="font-display text-xl font-bold mb-3">For you</h2>
        <div className="flex gap-3 overflow-x-auto snap-x">
          <div className="snap-start shrink-0 w-80 rounded-3xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--secondary), var(--highlight))" }}>
            <div className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-40" style={{ background: "linear-gradient(135deg, var(--accent-new), var(--primary))", filter: "blur(20px)" }} />
            <div className="relative z-10">
              <div className="font-display text-2xl font-bold text-black">Music for Your Mood</div>
              <p className="text-xs text-black/80 mt-1 max-w-[180px]">A mix tuned to your vibe and favorite languages.</p>
              <button className="mt-4 px-4 py-2 rounded-full bg-black text-white text-sm font-semibold flex items-center gap-2"><Play size={14} fill="currentColor" /> Check out</button>
            </div>
          </div>
          <div className="snap-start shrink-0 w-80 rounded-3xl glass p-5" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-bold">Popular</h2>
          <button className="text-sm text-muted flex items-center">Show all <ChevronRight size={16} /></button>
        </div>
        <div className="space-y-3">
          {filteredSongs.slice(0, 8).map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <Cover song={s} size={64} square coverUrl={(s as any).coverUrl} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{s.title}</div>
                <div className="text-xs text-muted truncate">{artistById(s.artistId)?.name || (s as any).artist}</div>
              </div>
              <button aria-label="Play" onClick={() => player.play(s, filteredSongs)} className="w-11 h-11 rounded-full glass flex items-center justify-center"><Play size={18} fill="currentColor" /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}