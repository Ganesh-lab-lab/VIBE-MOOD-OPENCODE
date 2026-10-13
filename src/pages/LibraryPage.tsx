import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Download } from "lucide-react";
import { usePlaylists } from "../context/PlaylistsContext";
import { useLikes } from "../context/LikesContext";
import { songs } from "../data/songs";
import AddToPlaylistSheet from "../components/AddToPlaylistSheet";

export default function LibraryPage() {
  const navigate = useNavigate();
  const { playlists, create } = usePlaylists();
  const likes = useLikes();
  const [filter, setFilter] = useState("Playlists");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const createPlaylist = () => {
    if (!name.trim()) return;
    create(name.trim());
    setName("");
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Your library</h1>
        <button aria-label="Create playlist" onClick={() => setCreating(true)} className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-2 text-on-primary flex items-center justify-center shadow-lg">
          <Plus size={20} strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {["Playlists","Artists","Albums","Downloaded"].map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={"px-4 py-1.5 rounded-full text-sm " + (filter === c ? "bg-gradient-to-r from-primary to-primary-2 text-on-primary" : "bg-surface/50 text-muted")}>{c}</button>
        ))}
      </div>

      {creating && (
        <div className="glass p-4">
          <div className="glass-inner flex gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name" className="flex-1 h-10 px-3 rounded-xl bg-surface/40" />
            <button onClick={createPlaylist} className="px-4 rounded-xl bg-gradient-to-r from-primary to-primary-2 text-on-primary">Create</button>
            <button onClick={() => setCreating(false)} className="px-4 rounded-xl bg-surface/40">Cancel</button>
          </div>
          {!name.trim() && <p className="text-xs text-secondary mt-2">Name cannot be empty.</p>}
        </div>
      )}

      <button onClick={() => navigate("/liked")} className="glass p-4 flex items-center gap-4 w-full">
        <div className="glass-inner flex items-center gap-4 w-full">
          <div className="w-14 h-14 rounded-lg" style={{ background: "linear-gradient(135deg,var(--secondary),var(--primary))" }} />
          <div className="text-left">
            <div className="font-semibold">Liked songs</div>
            <div className="text-xs text-muted">{likes.liked.size} songs</div>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map((pl) => (
          <button key={pl.id} onClick={() => navigate("/playlist/" + pl.id)} className="glass p-3 text-left hover:scale-[1.02] transition-transform">
            <div className="glass-inner space-y-2">
              <div className="w-full aspect-square rounded-2xl" style={{ background: pl.color ? `linear-gradient(135deg, ${pl.color}, var(--highlight))` : "linear-gradient(135deg,var(--primary),var(--highlight))" }} />
              <div className="font-semibold text-sm truncate">{pl.name}</div>
              <div className="text-xs text-muted">Playlist, {pl.songIds.length} songs</div>
            </div>
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-display text-lg font-bold mb-2">Downloaded</h3>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Download size={14} strokeWidth={1.75} /> Sample offline badge
          <span className="px-2 py-0.5 rounded-full bg-highlight/20 text-highlight">Offline</span>
        </div>
      </div>
    </div>
  );
}
