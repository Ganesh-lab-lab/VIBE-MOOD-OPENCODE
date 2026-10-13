import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Search, Bell, Plus, Heart, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Music, List } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { useLikes } from "../context/LikesContext";
import { usePlaylists } from "../context/PlaylistsContext";
import { artists } from "../data/artists";
import VibeRing from "../components/VibeRing";
import LyricsFull from "../components/LyricsFull";
import Cover from "../components/Cover";

function findArtist(id: string) { return artists.find((a) => a.id === id); }
function fmt(s: number) { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, "0")}`; }

export default function DesktopLayout() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const player = usePlayer();

  return (
    <div className="h-screen flex flex-col p-4 gap-4">
      <div className="glass px-4 py-3 flex items-center gap-3">
        <div className="glass-inner flex items-center gap-3 w-full">
          <button aria-label="Home" onClick={() => navigate("/")} className="w-10 h-10 rounded-full bg-surface/60 flex items-center justify-center hover:scale-105 transition-transform">
            <Home size={20} strokeWidth={1.75} />
          </button>
          <div className="flex-1 relative">
            <Search size={18} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              placeholder="What do you want to play?"
              className="w-full h-10 pl-11 pr-4 rounded-full bg-surface/40 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              onKeyDown={(e) => { if (e.key === "Enter") navigate("/search"); }}
            />
          </div>
          <button aria-label="Notifications" className="w-10 h-10 rounded-full bg-surface/40 flex items-center justify-center">
            <Bell size={18} strokeWidth={1.75} />
          </button>
          <button aria-label="Profile" onClick={() => navigate("/settings")} className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-display font-bold">
            {user?.name?.[0]?.toUpperCase() || "V"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <aside className="glass w-[290px] flex flex-col p-4 min-h-0">
          <div className="glass-inner flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold">Your library</h2>
              <button aria-label="Create playlist" onClick={() => navigate("/library")} className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30"><Plus size={18} strokeWidth={1.75} /></button>
            </div>
            <div className="flex gap-2 mb-3 overflow-x-auto">
              {["Playlists","Artists","Albums","Downloaded"].map((c) => (
                <button key={c} className="px-3 py-1 rounded-full text-xs bg-surface/50 text-muted hover:text-text whitespace-nowrap">{c}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-1">
              <button onClick={() => navigate("/liked")} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40">
                <div className="w-11 h-11 rounded-lg" style={{ background: "linear-gradient(135deg,var(--secondary),var(--primary))" }} />
                <div className="text-left">
                  <div className="text-sm font-semibold">Liked songs</div>
                  <div className="text-xs text-muted">Playlist</div>
                </div>
              </button>
              <LeftPlaylists navigate={navigate} />
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <VibeRing size={44} />
              <button aria-label="Auto theme" onClick={() => theme.setMode("auto")} className="w-10 h-10 rounded-full bg-surface/40 flex items-center justify-center text-xs">
                Auto
              </button>
            </div>
          </div>
        </aside>

        <main className="glass flex-1 min-h-0 p-6 overflow-y-auto">
          <div className="glass-inner">
            <Outlet />
          </div>
        </main>

        <aside className="glass w-[320px] p-4 min-h-0 overflow-y-auto">
          <div className="glass-inner">
            <NowPlayingPanel player={player} navigate={navigate} />
          </div>
        </aside>
      </div>

      <PlayerBar player={player} />
    </div>
  );
}

function LeftPlaylists({ navigate }: any) {
  const { playlists } = usePlaylists();
  return (
    <>
      {playlists.map((pl: any) => (
        <button key={pl.id} onClick={() => navigate("/playlist/" + pl.id)} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40">
          <div className="w-11 h-11 rounded-lg" style={{ background: pl.color ? `linear-gradient(135deg, ${pl.color}, var(--highlight))` : "linear-gradient(135deg,var(--primary),var(--highlight))" }} />
          <div className="text-left min-w-0">
            <div className="text-sm font-semibold truncate">{pl.name}</div>
            <div className="text-xs text-muted">Playlist, {pl.songIds.length} songs</div>
          </div>
        </button>
      ))}
    </>
  );
}

function NowPlayingPanel({ player, navigate }: any) {
  const likes = useLikes();
  const s = player.current;
  if (!s) return <div className="text-muted text-sm">Nothing playing</div>;
  const artist = findArtist(s.artistId);
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-muted">Now playing</div>
      <div className="relative mx-auto w-44 h-44">
        <Cover song={s} size={176} spin />
      </div>
      <div className="text-center">
        <div className="font-display text-lg font-bold">{s.title}</div>
        <button className="text-sm text-muted hover:underline" onClick={() => navigate("/artist/" + s.artistId)}>{artist?.name}</button>
      </div>
      <div className="flex justify-center gap-3">
        <button aria-label="Like" onClick={() => likes.toggle(s.id)} className="w-9 h-9 rounded-full bg-surface/40 flex items-center justify-center">
          <Heart size={18} strokeWidth={1.75} fill={likes.isLiked(s.id) ? "var(--secondary)" : "none"} color={likes.isLiked(s.id) ? "var(--secondary)" : "currentColor"} />
        </button>
        <button aria-label="Add to playlist" onClick={() => {}} className="w-9 h-9 rounded-full bg-surface/40 flex items-center justify-center text-xs">+</button>
      </div>
      <LyricsFull compact />
      <div>
        <div className="text-xs text-muted mb-1">Up next</div>
        <ul className="space-y-1">
          {player.queue.filter((x: any) => x.id !== s.id).slice(0, 6).map((q: any) => (
            <li key={q.id} className="flex items-center justify-between text-sm">
              <button onClick={() => player.play(q)} className="truncate text-left hover:text-primary">{q.title}</button>
              <span className="text-muted text-xs">{fmt(q.duration)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PlayerBar({ player }: any) {
  const likes = useLikes();
  const s = player.current;
  if (!s) return null;
  return (
    <div className="glass px-4 py-3">
      <div className="glass-inner flex items-center gap-4">
        <div className="flex items-center gap-3 w-56">
          <Cover song={s} size={48} />
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{s.title}</div>
            <div className="text-xs text-muted truncate">{findArtist(s.artistId)?.name}</div>
          </div>
          <button aria-label="Like" onClick={() => likes.toggle(s.id)}>
            <Heart size={18} strokeWidth={1.75} fill={likes.isLiked(s.id) ? "var(--secondary)" : "none"} color={likes.isLiked(s.id) ? "var(--secondary)" : "currentColor"} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button aria-label="Shuffle" onClick={() => player.setShuffle(!player.shuffle)} className={"w-8 h-8 rounded-full flex items-center justify-center " + (player.shuffle ? "text-primary" : "text-muted")}><Shuffle size={16} strokeWidth={1.75} /></button>
            <button aria-label="Previous" onClick={player.prev} className="w-9 h-9 rounded-full bg-surface/40 flex items-center justify-center"><SkipBack size={18} strokeWidth={1.75} /></button>
            <button aria-label="Play pause" onClick={player.toggle} className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center">
              {player.isPlaying ? <Pause size={20} strokeWidth={1.75} fill="currentColor" /> : <Play size={20} strokeWidth={1.75} fill="currentColor" />}
            </button>
            <button aria-label="Next" onClick={player.next} className="w-9 h-9 rounded-full bg-surface/40 flex items-center justify-center"><SkipForward size={18} strokeWidth={1.75} /></button>
            <button aria-label="Repeat" onClick={() => player.setRepeat(player.repeat === "off" ? "all" : player.repeat === "all" ? "one" : "off")} className={"w-8 h-8 rounded-full flex items-center justify-center " + (player.repeat !== "off" ? "text-primary" : "text-muted")}><Repeat size={16} strokeWidth={1.75} /></button>
          </div>
          <div className="w-full flex items-center gap-2 text-xs text-muted">
            <span>{fmt(player.currentTime)}</span>
            <input type="range" min={0} max={player.duration || 1} value={player.currentTime} onChange={(e) => player.seek(Number(e.target.value))} className="flex-1 accent-primary" />
            <span>{fmt(player.duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-44">
          <button aria-label="Lyrics" className="w-8 h-8 rounded-full bg-surface/40 flex items-center justify-center"><Music size={16} strokeWidth={1.75} /></button>
          <button aria-label="Queue" className="w-8 h-9 rounded-full bg-surface/40 flex items-center justify-center"><List size={16} strokeWidth={1.75} /></button>
          <input type="range" min={0} max={100} defaultValue={70} className="flex-1" aria-label="Volume" />
        </div>
      </div>
    </div>
  );
}

export {};
