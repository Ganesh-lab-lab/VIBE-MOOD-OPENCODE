import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search as SearchIcon } from "lucide-react";
import { songs as fakeSongs, artistById } from "../data/songs";
import { artists as fakeArtists } from "../data/artists";
import { usePlaylists } from "../context/PlaylistsContext";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES } from "../lib/languages";
import { usePlayer } from "../context/PlayerContext";
import Cover from "../components/Cover";
import { apiSearch } from "../lib/api";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const player = usePlayer();
  const { playlists } = usePlaylists();
  const { user } = useAuth();
  const userLangs = user?.languages || ["en"];
  const orderedLangs = [...userLangs, ...LANGUAGES.map(l=>l.code).filter(c=>!userLangs.includes(c))];
  const [lang, setLang] = useState("");
  const [recent, setRecent] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("vibemood_recent")||"[]"); } catch { return []; } });

  useEffect(() => { const t = setTimeout(() => setDebounced(q), 350); return () => clearTimeout(t); }, [q]);

  useEffect(() => {
    if (!debounced.trim()) { setResults(null); return; }
    let cancelled = false;
    setLoading(true);
    apiSearch(debounced, lang || undefined).then((r) => { if (!cancelled) setResults(r); }).catch(() => {
      if (cancelled) return;
      const ql = debounced.toLowerCase();
      setResults({
        songs: fakeSongs.filter((s) => s.title.toLowerCase().includes(ql) || artistById(s.artistId).name.toLowerCase().includes(ql)),
        artists: fakeArtists.filter((a) => a.name.toLowerCase().includes(ql)),
        albums: [],
      });
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debounced, lang]);

  const submit = () => {
    if (!q.trim()) return;
    const next = [q.trim(), ...recent.filter((r) => r !== q.trim())].slice(0,8);
    setRecent(next);
    localStorage.setItem("vibemood_recent", JSON.stringify(next));
  };

  const songs = results?.songs || [];
  const artists = results?.artists || [];
  const albums = results?.albums || [];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto">
        <button onClick={() => setLang("")} className={"px-3 py-1.5 rounded-full text-xs " + (!lang ? "bg-primary text-white" : "bg-surface/50 text-muted")}>All</button>
        {orderedLangs.map((c) => { const l = LANGUAGES.find(x=>x.code===c)!; return (
          <button key={c} onClick={() => setLang(c)} className={"px-3 py-1.5 rounded-full text-xs " + (lang===c ? "bg-primary text-white" : "bg-surface/50 text-muted")}>{l.nativeName}</button>
        );})}
      </div>
      <div className="relative">
        <SearchIcon size={18} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter")submit();}} placeholder="What do you want to play?" className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface/40 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      {loading && <div className="text-muted text-sm">Searching...</div>}

      {!q && (
        <>
          {recent.length>0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Recent searches</h2>
              <div className="flex flex-wrap gap-2">{recent.map((r)=><button key={r} onClick={()=>setQ(r)} className="px-3 py-1.5 rounded-full bg-surface/50 text-sm">{r}</button>)}</div>
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-bold mb-3">Browse moods & genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Chill","Focus","Party","Workout","Romantic","Sad","Roadtrip"].map((g)=><button key={g} className="glass p-4 rounded-3xl text-left" style={{ borderRadius: 999 }}><span className="glass-inner font-display font-bold">{g}</span></button>)}
            </div>
          </div>
        </>
      )}

      {q && results && (
        <>
          {artists.length>0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Artists</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {artists.map((a:any)=>(
                  <button key={a.id} onClick={()=>navigate("/artist/"+a.id)} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg,var(--primary),var(--highlight))" }}>{(a.name||"?")[0]}</div>
                    <span className="text-xs">{a.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {albums.length>0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Albums</h2>
              <div className="space-y-1">
                {albums.map((al:any,i:number)=>(
                  <div key={i} className="p-2 rounded-xl hover:bg-surface/40 text-sm">{al.name}</div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-bold mb-2">Songs</h2>
            <div className="space-y-1">
              {songs.map((s:any)=>(
                <div key={s.id} onClick={async ()=>{ try { const p=await (await fetch(`/api/play/${s.id}`)).json(); player.play({...s, youtubeId: p.youtubeId, previewUrl: p.previewUrl || s.previewUrl, coverColors: s.coverColors || ["var(--primary)","var(--highlight)"]}, songs); } catch { player.play({...s, coverColors: s.coverColors || ["var(--primary)","var(--highlight)"]}, songs); } }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 cursor-pointer">
                  <Cover song={s} coverUrl={s.coverUrl} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{s.title}</div>
                    <div className="text-xs text-muted truncate">{s.artist}</div>
                  </div>
                </div>
              ))}
              {songs.length===0 && <p className="text-muted text-sm">No results.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}