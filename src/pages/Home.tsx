import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Play, Heart } from "lucide-react";
import { useLikes } from "../context/LikesContext";
import { fmt } from "../lib/format";
import RowMenu from "../components/RowMenu";
import { useTheme } from "../context/ThemeContext";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { greetings } from "../lib/languages";
import { songs, artistById } from "../data/songs";
import { artists } from "../data/artists";
import { LANGUAGES, langByCode } from "../lib/languages";
import { apiNew } from "../lib/api";
import Cover from "../components/Cover";

function greeting(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const vibeFilter = (vibe: string | null) => (s: any) => {
  if (!vibe || vibe === "auto") return true;
  return (s.vibeTags || []).includes(vibe);
};

export default function Home() {
  const { user } = useAuth();
  const { mode, effectiveHour } = useTheme();
  const player = usePlayer();
  const navigate = useNavigate();
  const [chip, setChip] = useState("All");
  const [lang, setLang] = useState("");
  const [releaseSongs, setReleaseSongs] = useState<any[]>(() => songs.filter((s) => s.isNew));
  const [toast, setToast] = useState("");
  const userLangs = (useAuth().user as any)?.languages || ["en"];
  const orderedLangs = [...userLangs, ...LANGUAGES.map(l=>l.code).filter(c=>!userLangs.includes(c))];

  useEffect(() => {
    apiNew(lang || undefined).then((r) => { if (r?.songs?.length) setReleaseSongs(r.songs); else setReleaseSongs([]); }).catch(() => {});
    let es: EventSource | null = null;
    try {
      es = new EventSource("/api/stream");
      es.addEventListener("new-releases", (ev: any) => {
        try {
          const d = JSON.parse(ev.data);
          if (d.count > 0) {
            const first = d.langs?.[0];
            const name = first ? langByCode(first.code)?.name : "";
            setToast(`${d.count} new ${name || ""} songs dropped`.trim());
            setTimeout(() => setToast(""), 4000);
            apiNew(lang || undefined).then((r) => { if (r?.songs?.length) setReleaseSongs(r.songs); }).catch(() => {});
          }
        } catch {}
      });
    } catch {}
    return () => { es?.close(); };
  }, [lang]);

  const vibe = mode === "auto" ? null : mode;
  const filteredSongs = useMemo(() => songs.filter(vibeFilter(vibe)), [vibe]);

  const continueSongs = filteredSongs.slice(0, 6);
  const madeFor = filteredSongs.filter((s) => s.vibeTags.includes(vibe || "chill")).slice(0, 8);
  const newSongs = songs.filter((s) => s.isNew);
  const popularArtists = artists.slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-muted text-lg">{greeting(effectiveHour)}</div>
        <h1 className="font-display text-5xl font-extrabold tracking-tight">{user?.name || "there"}</h1>
        {user?.languages?.[0] && greetings[user.languages[0]] && <div className="text-sm text-muted mt-1">{greetings[user.languages[0]]}</div>}
      </div>

      {toast && <div className="fixed top-4 right-4 z-50 glass px-4 py-2 text-sm text-primary">{toast}</div>}

      <div className="flex gap-2 overflow-x-auto">
        <button onClick={() => setLang("")} className={"px-3 py-1.5 rounded-full text-xs " + (!lang ? "bg-primary text-on-primary" : "bg-surface/50 text-muted")}>All</button>
        {orderedLangs.map((c) => { const l = LANGUAGES.find(x=>x.code===c)!; return (
          <button key={c} onClick={() => setLang(c)} className={"px-3 py-1.5 rounded-full text-xs " + (lang===c ? "bg-primary text-on-primary" : "bg-surface/50 text-muted")}>{l.nativeName}</button>
        );})}
      </div>

      <div className="flex gap-2">
        {["All","Music","New"].map((c) => (
          <button key={c} onClick={() => setChip(c)} className={"px-4 py-1.5 rounded-full text-sm font-medium " + (chip === c ? "bg-primary text-on-primary" : "bg-surface/50 text-muted")}>{c}</button>
        ))}
      </div>

      {/* quick access grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {continueSongs.slice(0, 8).map((s) => (
          <button key={s.id} onClick={() => player.play(s, filteredSongs)} className="glass flex items-center gap-3 p-2 hover:scale-[1.02] transition-transform text-left">
            <div className="glass-inner flex items-center gap-3 w-full">
              <Cover song={s} size={48} />
              <span className="font-medium text-sm truncate flex-1">{s.title}</span>
              <span className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100"><Play size={16} strokeWidth={1.75} fill="currentColor" /></span>
            </div>
          </button>
        ))}
      </div>

      <Section title="Continue listening">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {continueSongs.map((s) => (
            <Card key={s.id} song={s} onPlay={() => player.play(s, filteredSongs)} />
          ))}
        </div>
      </Section>

      <Section title="Made for your vibe">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {madeFor.length ? madeFor.map((s) => <Card key={s.id} song={s} onPlay={() => player.play(s, filteredSongs)} />) : filteredSongs.slice(0,4).map(s => <Card key={s.id} song={s} onPlay={() => player.play(s, filteredSongs)} />)}
        </div>
      </Section>

      <Section title="Release pulse">
        <div className="flex gap-6 overflow-x-auto pb-2">
          {releaseSongs.map((s) => (
            <button key={s.id} onClick={() => player.play(s, releaseSongs)} className="flex flex-col items-center gap-2 min-w-[90px]">
              <div className="relative">
                <div className="ring-pulse absolute inset-0 rounded-full" style={{ background: "var(--accent-new)", opacity: 0.5 }} />
                <Cover song={s} size={84} />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-new border-2 border-bg" />
              </div>
              <div className="text-xs font-medium text-center truncate w-20">{s.title}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Popular artists">
        <div className="flex gap-6 overflow-x-auto pb-2">
          {popularArtists.map((a) => (
            <button key={a.id} onClick={() => navigate("/artist/" + a.id)} className="flex flex-col items-center gap-2 min-w-[90px]">
              <div className="w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-white" style={{ background: `linear-gradient(135deg, ${a.colors[0]}, ${a.colors[1]})` }}>
                {a.name.split(" ").map((w) => w[0]).join("").slice(0,2)}
              </div>
              <div className="text-xs font-medium text-center">{a.name}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Best new songs" action="See all">
        <div className="space-y-1">
          {songs.filter((s) => s.isNew).map((s, i) => (
            <SongRow key={s.id} index={i + 1} song={s} onPlay={() => player.play(s, songs)} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, action, children }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {action && <button className="text-xs text-muted hover:text-text">{action}</button>}
      </div>
      {children}
    </div>
  );
}

function Card({ song, onPlay }: any) {
  const likes = useLikes();
  const navigate = useNavigate();
  const artist = artistById(song.artistId);
  return (
    <div className="glass p-3 hover:scale-[1.02] transition-transform group">
      <div className="glass-inner space-y-2">
        <div className="relative">
          <Cover song={song} size={104} />
          <button onClick={onPlay} aria-label="Play" className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play size={16} strokeWidth={1.75} fill="currentColor" /></button>
        </div>
        <div className="font-semibold text-sm truncate">{song.title}</div>
        <button className="text-xs text-muted truncate hover:underline" onClick={() => navigate("/artist/" + song.artistId)}>{artist?.name}</button>
      </div>
    </div>
  );
}

function SongRow({ index, song, onPlay }: any) {
  const likes = useLikes();
  const navigate = useNavigate();
  const artist = artistById(song.artistId);
  const [menu, setMenu] = useState(false);
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 group">
      <span className="text-xs text-muted w-5">{index}</span>
      <Cover song={song} size={44} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{song.title} {song.isNew && <span className="inline-block w-2 h-2 rounded-full bg-accent-new ml-1 align-middle" />}</div>
        <button onClick={() => navigate("/artist/" + song.artistId)} className="text-xs text-muted truncate hover:underline">{artist?.name}</button>
        {song.filmName && <div className="text-[10px] text-muted truncate">{song.filmName}{song.musicDirector ? ` • ${song.musicDirector}` : ""}</div>}
      </div>
      <span className="text-xs text-muted">{fmt(song.duration)}</span>
      <RowMenu song={song} />
    </div>
  );
}

