import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Play, Shuffle, BadgeCheck, UserPlus, UserCheck } from "lucide-react";
import { artists } from "../data/artists";
import { songs, artistById } from "../data/songs";
import { usePlayer } from "../context/PlayerContext";
import Cover from "../components/Cover";
import { fmt } from "../lib/format";

export default function ArtistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = artists.find((a) => a.id === id);
  const player = usePlayer();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState("Popular");
  const [expandedBio, setExpandedBio] = useState(false);

  if (!artist) return <div className="text-muted">Artist not found</div>;

  const artistSongs = songs.filter((s) => s.artistId === artist.id);
  const latest = artistSongs.find((s) => s.isNew) || artistSongs[0];

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${artist.colors[0]}, ${artist.colors[1]})` }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-4 left-6 text-white">
          <h1 className="font-display text-4xl font-extrabold flex items-center gap-2">
            {artist.name} {artist.verified && <BadgeCheck size={28} strokeWidth={1.75} className="text-accent-new" />}
          </h1>
          <p className="text-sm opacity-90">{artist.monthlyListeners.toLocaleString()} monthly listeners</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full -mt-12 border-4 border-bg flex items-center justify-center text-white font-display font-bold text-2xl" style={{ background: `linear-gradient(135deg, ${artist.colors[0]}, ${artist.colors[1]})` }}>
          {artist.name.split(" ").map((w) => w[0]).join("").slice(0,2)}
        </div>
        <div className="flex-1">
          <p className={"text-sm text-muted " + (expandedBio ? "" : "line-clamp-2")}>{artist.bio}</p>
          <button onClick={() => setExpandedBio((b) => !b)} className="text-xs text-primary">{expandedBio ? "less" : "more"}</button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => { if (artistSongs.length) player.play(artistSongs[0], artistSongs); }} className="px-6 h-11 rounded-full bg-primary text-on-primary flex items-center gap-2 font-semibold"><Play size={16} strokeWidth={1.75} fill="currentColor" /> Play</button>
        <button onClick={() => { player.setShuffle(true); if (artistSongs.length) player.play(artistSongs[Math.floor(Math.random()*artistSongs.length)], artistSongs); }} className="px-6 h-11 rounded-full bg-surface/50 flex items-center gap-2"><Shuffle size={16} strokeWidth={1.75} /> Shuffle</button>
        <button onClick={() => setFollowing((f) => !f)} className="px-4 h-11 rounded-full glass flex items-center gap-2">
          {following ? <UserCheck size={16} strokeWidth={1.75} /> : <UserPlus size={16} strokeWidth={1.75} />}
          {following ? "Following" : "Follow"}
        </button>
      </div>

      <div className="flex gap-2 border-b border-white/10">
        {["Popular","Albums","Singles","About"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"px-4 py-2 text-sm font-medium border-b-2 " + (tab === t ? "border-primary text-primary" : "border-transparent text-muted")}>{t}</button>
        ))}
      </div>

      {tab === "Popular" && (
        <div className="space-y-1">
          {artistSongs.map((s, i) => (
            <div key={s.id} onClick={() => player.play(s, artistSongs)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 cursor-pointer">
              <span className="text-xs text-muted w-5">{i + 1}</span>
              <Cover song={s} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{s.title}</div>
              </div>
              <span className="text-xs text-muted">{s.plays.toLocaleString()} plays</span>
              <span className="text-xs text-muted">{fmt(s.duration)}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Albums" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from(new Set(artistSongs.map((s) => s.album))).map((album) => {
            const first = artistSongs.find((s) => s.album === album)!;
            const isNew = artistSongs.some((s) => s.album === album && s.isNew);
            return (
              <div key={album} className="glass p-3">
                <div className="glass-inner space-y-2">
                  <div className="relative">
                    <Cover song={first} size={100} />
                    {isNew && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-new" />}
                  </div>
                  <div className="font-semibold text-sm">{album}</div>
                  <div className="text-xs text-muted">{artistSongs.filter((s) => s.album === album).length} songs</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "Singles" && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {artistSongs.map((s) => (
            <div key={s.id} className="glass p-3 min-w-[140px]">
              <div className="glass-inner space-y-2 text-center">
                <Cover song={s} size={80} />
                <div className="text-sm font-semibold truncate">{s.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "About" && (
        <div className="glass p-4">
          <div className="glass-inner space-y-3">
            <p className="text-sm">{artist.bio}</p>
            <div className="flex gap-3 text-muted">
              <span>Instagram</span><span>X</span><span>Website</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display text-xl font-bold mb-3">Latest release</h2>
        <div className="glass p-4 inline-flex items-center gap-4">
          <div className="glass-inner flex items-center gap-4">
            <Cover song={latest} size={72} />
            <div>
              <div className="text-xs text-accent-new font-semibold">JUST DROPPED</div>
              <div className="font-semibold">{latest.title}</div>
              <div className="text-xs text-muted">{latest.album}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold mb-3">Fans also like</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {artists.filter((a) => a.id !== artist.id).slice(0, 6).map((a) => (
            <button key={a.id} onClick={() => navigate("/artist/" + a.id)} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${a.colors[0]}, ${a.colors[1]})` }}>{a.name[0]}</div>
              <span className="text-xs">{a.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
