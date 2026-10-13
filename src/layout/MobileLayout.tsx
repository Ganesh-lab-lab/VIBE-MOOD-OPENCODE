import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Search as SearchIcon, Library as LibIcon, Zap, X, Heart } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useLikes } from "../context/LikesContext";
import { artists } from "../data/artists";
import VibeRing from "../components/VibeRing";
import Cover from "../components/Cover";

function findArtist(id: string) { return artists.find((a) => a.id === id); }
function fmt(s: number) { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, "0")}`; }

export default function MobileLayout() {
  const navigate = useNavigate();
  const loc = useLocation();
  const player = usePlayer();
  const likes = useLikes();
  const [expanded, setExpanded] = useState(false);
  const s = player.current;

  if (expanded && s) {
    return (
      <div className="fixed inset-0 z-40 overflow-y-auto p-6" style={{ background: "var(--bg)" }}>
        <button aria-label="Close" onClick={() => setExpanded(false)} className="mb-4 w-10 h-10 rounded-full glass flex items-center justify-center"><X size={18} strokeWidth={1.75} /></button>
        <div className="flex flex-col items-center gap-4">
          <Cover song={s} size={240} spin={false} />
          <div className="text-center">
            <div className="font-display text-2xl font-bold">{s.title}</div>
            <button className="text-muted" onClick={() => navigate("/artist/" + s.artistId)}>{findArtist(s.artistId)?.name}</button>
          </div>
          <div className="flex gap-4">
            <button aria-label="Like" onClick={() => likes.toggle(s.id)} className="w-11 h-11 rounded-full glass flex items-center justify-center">
              <Heart size={20} strokeWidth={1.75} fill={likes.isLiked(s.id) ? "var(--secondary)" : "none"} color={likes.isLiked(s.id) ? "var(--secondary)" : "currentColor"} />
            </button>
          </div>
          <div className="w-full">
            <input type="range" min={0} max={player.duration || 1} value={player.currentTime} onChange={(e) => player.seek(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-muted"><span>{fmt(player.currentTime)}</span><span>{fmt(player.duration)}</span></div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={player.prev} className="w-11 h-11 rounded-full glass flex items-center justify-center">⏮</button>
            <button onClick={player.toggle} className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center">{player.isPlaying ? "⏸" : "▶"}</button>
            <button onClick={player.next} className="w-11 h-11 rounded-full glass flex items-center justify-center">⏭</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-28">
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
      {s && (
        <button onClick={() => setExpanded(true)} className="fixed bottom-24 left-4 right-4 glass px-3 py-2 flex items-center gap-3 z-30">
          <div className="glass-inner flex items-center gap-3 w-full">
            <Cover song={s} size={40} />
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-semibold truncate">{s.title}</div>
              <div className="text-xs text-muted truncate">{findArtist(s.artistId)?.name}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); player.toggle(); }} aria-label="Play pause" className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">{player.isPlaying ? "⏸" : "▶"}</button>
            <button onClick={(e) => { e.stopPropagation(); likes.toggle(s.id); }} aria-label="Like" className="w-9 h-9 rounded-full bg-surface/40 flex items-center justify-center">
              <Heart size={16} strokeWidth={1.75} fill={likes.isLiked(s.id) ? "var(--secondary)" : "none"} color={likes.isLiked(s.id) ? "var(--secondary)" : "currentColor"} />
            </button>
          </div>
        </button>
      )}
      <nav className="fixed bottom-0 left-0 right-0 glass mx-3 mb-3 px-2 py-2 z-30" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="glass-inner flex items-center justify-around">
          <button aria-label="Home" onClick={() => navigate("/")} className={"flex flex-col items-center gap-0.5 p-2 " + (loc.pathname === "/" ? "text-primary" : "text-muted")}>
            <Home size={22} strokeWidth={1.75} />
            {loc.pathname === "/" && <span className="w-1 h-1 rounded-full bg-primary" />}
          </button>
          <button aria-label="New" onClick={() => navigate("/new")} className={"flex flex-col items-center gap-0.5 p-2 " + (loc.pathname === "/new" ? "text-primary" : "text-muted")}>
            <Zap size={22} strokeWidth={1.75} />
            {loc.pathname === "/new" && <span className="w-1 h-1 rounded-full bg-primary" />}
          </button>
          <div className="-mt-6"><VibeRing size={58} /></div>
          <button aria-label="Search" onClick={() => navigate("/search")} className={"flex flex-col items-center gap-0.5 p-2 " + (loc.pathname === "/search" ? "text-primary" : "text-muted")}>
            <SearchIcon size={22} strokeWidth={1.75} />
            {loc.pathname === "/search" && <span className="w-1 h-1 rounded-full bg-primary" />}
          </button>
          <button aria-label="Library" onClick={() => navigate("/library")} className={"flex flex-col items-center gap-0.5 p-2 " + (loc.pathname === "/library" ? "text-primary" : "text-muted")}>
            <LibIcon size={22} strokeWidth={1.75} />
            {loc.pathname === "/library" && <span className="w-1 h-1 rounded-full bg-primary" />}
          </button>
        </div>
      </nav>
    </div>
  );
}
