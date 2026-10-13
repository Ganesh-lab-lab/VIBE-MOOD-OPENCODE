import React, { useState } from "react";
import { MoreHorizontal, ListPlus, Heart, Trash2 } from "lucide-react";
import { useLikes } from "../context/LikesContext";
import { usePlaylists } from "../context/PlaylistsContext";
import { songs } from "../data/songs";
import AddToPlaylistSheet from "./AddToPlaylistSheet";

export default function RowMenu({ song, onRemoveFromPlaylist }: { song: any; onRemoveFromPlaylist?: (plId: string, songId: string) => void }) {
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const likes = useLikes();
  return (
    <div className="relative">
      <button aria-label="More" onClick={() => setOpen((o) => !o)} className="w-8 h-8 rounded-full bg-surface/40 flex items-center justify-center text-muted">
        <MoreHorizontal size={16} strokeWidth={1.75} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-40 glass p-2 w-44">
          <div className="glass-inner space-y-1">
            <button onClick={() => { likes.toggle(song.id); setOpen(false); }} className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-surface/40 flex items-center gap-2">
              <Heart size={14} strokeWidth={1.75} /> {likes.isLiked(song.id) ? "Unlike" : "Like"}
            </button>
            <button onClick={() => { setSheet(true); setOpen(false); }} className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-surface/40 flex items-center gap-2">
              <ListPlus size={14} strokeWidth={1.75} /> Add to playlist
            </button>
            {onRemoveFromPlaylist && (
              <button onClick={() => { setOpen(false); }} className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-surface/40 flex items-center gap-2 text-secondary">
                <Trash2 size={14} strokeWidth={1.75} /> Remove
              </button>
            )}
          </div>
        </div>
      )}
      {sheet && <AddToPlaylistSheet song={song} onClose={() => setSheet(false)} />}
    </div>
  );
}
