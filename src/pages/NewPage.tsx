import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiNew } from "../lib/api";
import { Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES } from "../lib/languages";
import { songs } from "../data/songs";
import { artists } from "../data/artists";

import Cover from "../components/Cover";
import RowMenu from "../components/RowMenu";
import { fmt } from "../lib/format";

export default function NewPage() {
  const player = usePlayer();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userLangs = user?.languages || ["en"];
  const orderedLangs = [...userLangs, ...LANGUAGES.map(l=>l.code).filter(c=>!userLangs.includes(c))];
  const [lang, setLang] = useState("");
  const [newSongs, setNewSongs] = useState(songs.filter((s) => s.isNew));
  useEffect(() => { apiNew(lang || undefined).then((r) => { if (r?.songs?.length) setNewSongs(r.songs); }).catch(()=>{}); }, [lang]);
  const featured = [
    { label: "NEW ALBUM", title: "Velvet Hours", artist: "Nova Lune", colors: ["var(--primary)","var(--highlight)"] as [string,string], play: () => player.play(songs.find(s=>s.id==="s1")!, songs) },
    { label: "UPDATED PLAYLIST", title: "Road Trip Radio", artist: "Vibemood", colors: ["var(--accent-new)","var(--primary)"] as [string,string], play: () => player.play(songs.find(s=>s.id==="s2")!, songs) },
    { label: "NEW ALBUM", title: "Resonance", artist: "Pulse Theory", colors: ["var(--accent-new)","var(--primary)"] as [string,string], play: () => player.play(songs.find(s=>s.id==="s8")!, songs) },
  ];
  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl font-extrabold">New</h1>
      <div className="flex gap-2 overflow-x-auto">
        <button onClick={() => setLang("")} className={"px-3 py-1.5 rounded-full text-xs " + (!lang ? "bg-primary text-white" : "bg-surface/50 text-muted")}>All</button>
        {orderedLangs.map((c) => { const l = LANGUAGES.find(x=>x.code===c)!; return (
          <button key={c} onClick={() => setLang(c)} className={"px-3 py-1.5 rounded-full text-xs " + (lang===c ? "bg-primary text-white" : "bg-surface/50 text-muted")}>{l.nativeName}</button>
        );})}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {featured.map((f, i) => (
          <div key={i} className="glass min-w-[260px] p-4 hover:scale-[1.02] transition-transform">
            <div className="glass-inner space-y-3">
              <div className="text-xs text-accent-new font-semibold">{f.label}</div>
              <Cover song={{ coverColors: f.colors }} size={160} />
              <div>
                <div className="font-display text-xl font-bold">{f.title}</div>
                <div className="text-sm text-muted">{f.artist}</div>
              </div>
              <button onClick={f.play} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center"><Play size={18} strokeWidth={1.75} fill="currentColor" /></button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold mb-3">Best new songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {newSongs.map((s, i) => {
            const artist = artists.find((a) => a.id === s.artistId);
            return (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40">
                <Cover song={s} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{s.title} <span className="inline-block w-2 h-2 rounded-full bg-accent-new ml-1 align-middle" /></div>
                  <div className="text-xs text-muted truncate">{artist?.name}</div>
                </div>
                <span className="text-xs text-muted">{fmt(s.duration)}</span>
                <RowMenu song={s} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

