import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Search as SearchIcon, Play, Shuffle } from "lucide-react";
import { fmt } from "../lib/format";
import { useLikes } from "../context/LikesContext";
import { usePlayer } from "../context/PlayerContext";
import { songs, artistById } from "../data/songs";
import Cover from "../components/Cover";
import RowMenu from "../components/RowMenu";

export default function LikedPage() {
  const likes = useLikes();
  const player = usePlayer();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const likedSongs = songs.filter((s) => likes.isLiked(s.id)).filter((s) => query ? s.title.toLowerCase().includes(query.toLowerCase()) : true);

  const playAll = () => { if (likedSongs.length) player.play(likedSongs[0], likedSongs); };
  const shuffle = () => { if (likedSongs.length) { player.setShuffle(true); player.play(likedSongs[Math.floor(Math.random()*likedSongs.length)], likedSongs); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 rounded-2xl" style={{ background: "linear-gradient(135deg,var(--secondary),var(--primary))" }} />
        <div>
          <div className="text-xs text-muted">Playlist</div>
          <h1 className="font-display text-4xl font-extrabold">Liked songs</h1>
          <div className="text-muted text-sm mt-1">{likedSongs.length} songs</div>
          <div className="flex gap-2 mt-3">
            <button onClick={playAll} className="px-4 h-9 rounded-full bg-primary text-on-primary flex items-center gap-2"><Play size={14} strokeWidth={1.75} fill="currentColor" /> Play</button>
            <button onClick={shuffle} className="px-4 h-9 rounded-full bg-surface/50 flex items-center gap-2"><Shuffle size={14} strokeWidth={1.75} /> Shuffle</button>
          </div>
        </div>
      </div>
      <div className="relative">
        <SearchIcon size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search within liked" className="w-full h-10 pl-10 rounded-xl bg-surface/40" />
      </div>
      {likedSongs.length === 0 ? (
        <div className="text-center text-muted py-12">
          <div className="text-4xl mb-2">♡</div>
          <p>No liked songs yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {likedSongs.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40">
              <span className="text-xs text-muted w-5">{i+1}</span>
              <Cover song={s} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{s.title}</div>
                <button onClick={() => navigate("/artist/" + s.artistId)} className="text-xs text-muted truncate hover:underline">{artistById(s.artistId).name}</button>
              </div>
              <div className="text-xs text-muted">{s.album}</div>
              <div className="text-xs text-muted">{new Date().getFullYear()}</div>
              <span className="text-xs text-muted">{fmt(s.duration)}</span>
              <RowMenu song={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

