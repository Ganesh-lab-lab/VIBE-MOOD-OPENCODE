import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Play, Shuffle, Trash2, Pencil, Plus, X, Search as SearchIcon } from "lucide-react";
import { usePlaylists } from "../context/PlaylistsContext";
import { usePlayer } from "../context/PlayerContext";
import { songs, artistById } from "../data/songs";
import Cover from "../components/Cover";
import RowMenu from "../components/RowMenu";
import { fmt } from "../lib/format";

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, rename, remove, removeSong, reorder, addSong } = usePlaylists();
  const player = usePlayer();
  const pl = playlists.find((p) => p.id === id);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(pl?.name || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  if (!pl) return <div className="text-muted">Playlist not found</div>;

  const playlistSongs = pl.songIds.map((sid) => songs.find((s) => s.id === sid)!).filter(Boolean);
  const colors = playlistSongs.length ? playlistSongs[0].coverColors : ["var(--primary)", "var(--highlight)"];

  const playAll = () => { if (playlistSongs.length) player.play(playlistSongs[0], playlistSongs); };
  const shuffle = () => { if (playlistSongs.length) { player.setShuffle(true); player.play(playlistSongs[Math.floor(Math.random()*playlistSongs.length)], playlistSongs); } };

  const availableToAdd = songs.filter((s) => !pl.songIds.includes(s.id) && (addQuery ? s.title.toLowerCase().includes(addQuery.toLowerCase()) : true));

  const handleDrop = (idx: number) => {
    if (dragFrom === null || dragFrom === idx) { setDragFrom(null); return; }
    reorder(pl.id, dragFrom, idx);
    setDragFrom(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 rounded-2xl" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} />
        <div className="flex-1">
          {editing ? (
            <div className="flex gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 h-10 px-3 rounded-xl bg-surface/40 text-2xl font-display font-bold" />
              <button onClick={() => { if (name.trim()) { rename(pl.id, name.trim()); } setEditing(false); }} className="px-4 rounded-xl bg-gradient-to-r from-primary to-primary-2 text-on-primary">Save</button>
              <button onClick={() => setEditing(false)} className="px-4 rounded-xl bg-surface/40">Cancel</button>
            </div>
          ) : (
            <h1 className="font-display text-4xl font-extrabold flex items-center gap-2">{pl.name} <button aria-label="Rename" onClick={() => { setName(pl.name); setEditing(true); }}><Pencil size={18} strokeWidth={1.75} className="text-muted" /></button></h1>
          )}
          <div className="text-muted text-sm mt-1">Playlist • {playlistSongs.length} songs</div>
          <div className="flex gap-2 mt-3">
            <button onClick={playAll} className="px-4 h-9 rounded-full bg-gradient-to-r from-primary to-primary-2 text-on-primary flex items-center gap-2"><Play size={14} strokeWidth={1.75} fill="currentColor" /> Play</button>
            <button onClick={shuffle} className="px-4 h-9 rounded-full bg-surface/50 flex items-center gap-2"><Shuffle size={14} strokeWidth={1.75} /> Shuffle</button>
            <button onClick={() => setAddOpen(true)} className="px-4 h-9 rounded-full bg-surface/50 flex items-center gap-2"><Plus size={14} strokeWidth={1.75} /> Add songs</button>
            <button onClick={() => setConfirmDelete(true)} className="px-4 h-9 rounded-full bg-surface/50 flex items-center gap-2 text-secondary"><Trash2 size={14} strokeWidth={1.75} /> Delete</button>
          </div>
        </div>
      </div>

      {playlistSongs.length === 0 ? (
        <div className="text-center text-muted py-12">
          <p>No songs yet</p>
          <button onClick={() => setAddOpen(true)} className="mt-3 px-4 h-9 rounded-full bg-gradient-to-r from-primary to-primary-2 text-on-primary">Add songs</button>
        </div>
      ) : (
        <div className="space-y-1">
          {playlistSongs.map((s, i) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDragFrom(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40"
            >
              <span className="text-xs text-muted w-5 cursor-grab">⋮⋮</span>
              <span className="text-xs text-muted w-5">{i + 1}</span>
              <Cover song={s} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{s.title}</div>
                <div className="text-xs text-muted truncate">{artistById(s.artistId).name}</div>
              </div>
              <span className="text-xs text-muted">{fmt(s.duration)}</span>
              <button onClick={() => removeSong(pl.id, s.id)} className="text-muted hover:text-secondary" aria-label="Remove"><X size={16} strokeWidth={1.75} /></button>
            </div>
          ))}
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setAddOpen(false)}>
          <div className="glass w-full max-w-lg m-3 p-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="glass-inner space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold">Add songs</h3>
                <button onClick={() => setAddOpen(false)}><X size={18} strokeWidth={1.75} /></button>
              </div>
              <div className="relative">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={addQuery} onChange={(e) => setAddQuery(e.target.value)} placeholder="Search songs" className="w-full h-10 pl-10 rounded-xl bg-surface/40" />
              </div>
              <div className="space-y-1">
                {availableToAdd.slice(0, 40).map((s) => (
                  <button key={s.id} onClick={() => addSong(pl.id, s.id)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 w-full text-left">
                    <Cover song={s} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{s.title}</div>
                      <div className="text-xs text-muted truncate">{artistById(s.artistId).name}</div>
                    </div>
                    <Plus size={16} strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="glass p-6 max-w-sm">
            <div className="glass-inner space-y-4">
              <p>Delete "{pl.name}"?</p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setConfirmDelete(false)} className="px-4 h-9 rounded-xl bg-surface/40">Cancel</button>
                <button onClick={() => { remove(pl.id); navigate("/library"); }} className="px-4 h-9 rounded-xl bg-secondary text-white">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

