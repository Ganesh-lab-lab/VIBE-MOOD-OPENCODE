import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search as SearchIcon } from "lucide-react";
import { songs, artistById } from "../data/songs";
import { artists } from "../data/artists";
import { usePlaylists } from "../context/PlaylistsContext";
import { usePlayer } from "../context/PlayerContext";
import Cover from "../components/Cover";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const player = usePlayer();
  const { playlists } = usePlaylists();
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("vibemood_recent") || "[]"); } catch { return []; }
  });

  const submit = () => {
    if (!q.trim()) return;
    const next = [q.trim(), ...recent.filter((r) => r !== q.trim())].slice(0, 8);
    setRecent(next);
    localStorage.setItem("vibemood_recent", JSON.stringify(next));
  };

  const filteredSongs = useMemo(() => q ? songs.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()) || artistById(s.artistId).name.toLowerCase().includes(q.toLowerCase())) : [], [q]);
  const filteredArtists = useMemo(() => q ? artists.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())) : [], [q]);
  const filteredPlaylists = useMemo(() => q ? playlists.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : [], [q]);

  const genres = ["Chill","Focus","Party","Workout","Romantic","Sad","Roadtrip"];

  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon size={18} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="What do you want to play?"
          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface/40 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {!q && (
        <>
          {recent.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button key={r} onClick={() => setQ(r)} className="px-3 py-1.5 rounded-full bg-surface/50 text-sm">{r}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-bold mb-3">Browse moods & genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {genres.map((g) => (
                <button key={g} className="glass p-4 rounded-3xl text-left" style={{ borderRadius: 999 }}>
                  <span className="glass-inner font-display font-bold">{g}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {q && (
        <>
          {filteredArtists.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Artists</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {filteredArtists.map((a) => (
                  <button key={a.id} onClick={() => navigate("/artist/" + a.id)} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${a.colors[0]}, ${a.colors[1]})` }}>{a.name[0]}</div>
                    <span className="text-xs">{a.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {filteredPlaylists.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Playlists</h2>
              <div className="space-y-1">
                {filteredPlaylists.map((p) => (
                  <button key={p.id} onClick={() => navigate("/playlist/" + p.id)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 w-full text-left">
                    <div className="w-11 h-11 rounded-lg" style={{ background: "linear-gradient(135deg,#7B2FF7,#3DE8D0)" }} />
                    <span className="text-sm font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-bold mb-2">Songs</h2>
            <div className="space-y-1">
              {filteredSongs.map((s) => (
                <div key={s.id} onClick={() => player.play(s, filteredSongs)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 cursor-pointer">
                  <Cover song={s} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{s.title}</div>
                    <div className="text-xs text-muted truncate">{artistById(s.artistId).name}</div>
                  </div>
                </div>
              ))}
              {filteredSongs.length === 0 && <p className="text-muted text-sm">No results.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
