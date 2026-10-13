import React from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "../context/PlayerContext";
import { artists } from "../data/artists";
import Cover from "../components/Cover";
import LyricsFull from "../components/LyricsFull";
import { fmt } from "../lib/format";
import { Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";
import { useLikes } from "../context/LikesContext";

export default function NowPlayingPage() {
  const player = usePlayer();
  const likes = useLikes();
  const navigate = useNavigate();
  const s = player.current;
  if (!s) return <div className="text-muted">Nothing playing</div>;
  const artist = artists.find((a) => a.id === s.artistId);
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <Cover song={s} size={260} />
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">{s.title}</h1>
        <button className="text-muted hover:underline" onClick={() => navigate("/artist/" + s.artistId)}>{artist?.name}</button>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => likes.toggle(s.id)} className="w-11 h-11 rounded-full glass flex items-center justify-center">
          <Heart size={20} strokeWidth={1.75} fill={likes.isLiked(s.id) ? "var(--secondary)" : "none"} color={likes.isLiked(s.id) ? "var(--secondary)" : "currentColor"} />
        </button>
      </div>
      <input type="range" min={0} max={player.duration || 1} value={player.currentTime} onChange={(e) => player.seek(Number(e.target.value))} className="w-full max-w-md" />
      <div className="flex justify-between w-full max-w-md text-xs text-muted"><span>{fmt(player.currentTime)}</span><span>{fmt(player.duration)}</span></div>
      <div className="flex items-center gap-4">
        <button onClick={player.prev} className="w-11 h-11 rounded-full glass flex items-center justify-center"><SkipBack size={20} strokeWidth={1.75} /></button>
        <button onClick={player.toggle} className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center">
          {player.isPlaying ? <Pause size={22} strokeWidth={1.75} fill="currentColor" /> : <Play size={22} strokeWidth={1.75} fill="currentColor" />}
        </button>
        <button onClick={player.next} className="w-11 h-11 rounded-full glass flex items-center justify-center"><SkipForward size={20} strokeWidth={1.75} /></button>
      </div>
      <div className="w-full max-w-md"><LyricsFull /></div>
    </div>
  );
}
