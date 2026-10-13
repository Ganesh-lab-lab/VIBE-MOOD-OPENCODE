import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { usePlaylists } from "../context/PlaylistsContext";
import { useTheme } from "../context/ThemeContext";

export default function AddToPlaylistSheet({ song, onClose }: { song: any; onClose: () => void }) {
  const { playlists, create, addSong, contains } = usePlaylists();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [toast, setToast] = useState("");

  const add = (plId: string) => {
    addSong(plId, song.id);
    setToast("Added to playlist");
    setTimeout(() => setToast(""), 1800);
  };

  const createNew = () => {
    if (!name.trim()) return;
    const pl = create(name.trim());
    addSong(pl.id, song.id);
    setName("");
    setCreating(false);
    setToast("Playlist created and song added");
    setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="glass w-full max-w-lg m-3 p-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="glass-inner space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">Add to playlist</h3>
            <button aria-label="Close" onClick={onClose}><X size={18} strokeWidth={1.75} /></button>
          </div>
          <button onClick={() => setCreating((c) => !c)} className="w-full text-left px-3 py-2 rounded-xl bg-surface/40 flex items-center gap-2 font-medium">
            <Plus size={16} strokeWidth={1.75} /> New playlist
          </button>
          {creating && (
            <div className="flex gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name" className="flex-1 h-10 px-3 rounded-xl bg-surface/40" />
              <button onClick={createNew} className="px-4 rounded-xl bg-primary text-on-primary">Create</button>
            </div>
          )}
          <div className="space-y-1">
            {playlists.map((pl) => (
              <button key={pl.id} onClick={() => add(pl.id)} className="w-full text-left px-3 py-2 rounded-xl hover:bg-surface/40 flex items-center justify-between">
                <span className="font-medium text-sm">{pl.name}</span>
                {contains(pl.id, song.id) && <Check size={16} strokeWidth={1.75} className="text-primary" />}
              </button>
            ))}
          </div>
          {toast && <div className="text-center text-sm text-primary">{toast}</div>}
        </div>
      </div>
    </div>
  );
}
