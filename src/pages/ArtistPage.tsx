import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import Cover from "../components/Cover";
import { apiArtist } from "../lib/api";

export default function ArtistPage() {
  const { id } = useParams();
  const decoded = decodeURIComponent(id || "");
  const navigate = useNavigate();
  const player = usePlayer();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decoded) return;
    setLoading(true);
    apiArtist(decoded).then(setData).catch(() => setData({ artist: { name: decoded }, songs: [], albums: [] })).finally(() => setLoading(false));
  }, [decoded]);

  const songs = data?.songs || [];
  const artist = data?.artist || { name: decoded };

  if (loading) return <div className="text-muted p-6">Loading...</div>;
  if (!songs.length) return (
    <div className="text-center py-12">
      <p className="text-muted">No songs found for this artist</p>
      <button onClick={() => navigate(-1)} className="mt-4 px-4 h-9 rounded-full glass">Back</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{artist.name}</h1>
      <button onClick={() => { if (songs.length) player.play(songs[0], songs); }} className="px-6 h-11 rounded-full bg-gradient-to-r from-primary to-primary-2 text-on-primary flex items-center gap-2 font-semibold"><Play size={16} fill="currentColor" /> Play</button>
      <div className="space-y-2">
        {songs.map((s: any) => (
          <div key={s.id} onClick={() => player.play(s, songs)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 cursor-pointer">
            <Cover song={s} coverUrl={s.coverUrl} size={44} square />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{s.title}</div>
              <div className="text-xs text-muted truncate">{s.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}