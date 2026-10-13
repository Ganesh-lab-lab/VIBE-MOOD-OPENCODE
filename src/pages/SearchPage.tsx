import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search as SearchIcon } from "lucide-react";
import { usePlaylists } from "../context/PlaylistsContext";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES } from "../lib/languages";
import Cover from "../components/Cover";
import { apiSearch } from "../lib/api";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [term, setTerm] = useState(q);
  const [lang, setLang] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const player = usePlayer();
  const { user } = useAuth();
  const userLangs = (user as any)?.languages || ["en"];
  const orderedLangs = [...userLangs, ...LANGUAGES.map((l) => l.code).filter((c: string) => !userLangs.includes(c))];

  useEffect(() => { setTerm(q); }, [q]);

  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    let cancelled = false;
    setLoading(true);
    apiSearch(q, lang || undefined).then((r) => { if (!cancelled) setResults(r); }).catch(() => { if (!cancelled) setResults({ songs: [], artists: [], albums: [] }); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [q, lang]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (term.trim()) setParams({ q: term.trim() });
  };

  const songs = results?.songs || [];
  const artists = results?.artists || [];
  const albums = results?.albums || [];
  const empty = !!q && !loading && songs.length === 0 && artists.length === 0 && albums.length === 0;

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="relative">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search songs, artists, albums" className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface/40 text-text focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </form>

      <div className="flex gap-2 overflow-x-auto">
        <button onClick={() => setLang("")} className={"px-3 py-1.5 rounded-full text-xs " + (!lang ? "bg-gradient-to-r from-primary to-primary-2 text-on-primary" : "glass")}>All</button>
        {orderedLangs.map((c: string) => { const l = LANGUAGES.find((x: any) => x.code === c)!; return (
          <button key={c} onClick={() => setLang(c)} className={"px-3 py-1.5 rounded-full text-xs " + (lang === c ? "bg-gradient-to-r from-primary to-primary-2 text-on-primary" : "glass")}>{l.nativeName}</button>
        );})}
      </div>

      {loading && <div className="text-muted text-sm">Searching...</div>}
      {empty && <div className="text-muted text-sm">No results for "{q}".</div>}

      {!loading && results && (
        <>
          {artists.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold mb-2">Artists</h2>
              <div className="space-y-2">
                {artists.map((a: any) => (
                  <button key={a.id} onClick={() => navigate("/artist/" + encodeURIComponent(a.name))} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 w-full text-left">
                    <Cover song={{ coverColors: ["var(--primary)", "var(--highlight)"] }} coverUrl={a.imageUrl} size={44} square />
                    <span className="text-sm font-medium">{a.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {albums.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold mb-2">Albums</h2>
              <div className="space-y-1">
                {albums.map((al: any, i: number) => <div key={i} className="p-2 rounded-xl text-sm">{al.name}</div>)}
              </div>
            </section>
          )}
          {songs.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold mb-2">Songs</h2>
              <div className="space-y-2">
                {songs.map((s: any) => (
                  <div key={s.id} onClick={async () => {
                    try {
                      const p = await (await fetch(`/api/play/${s.id}`)).json();
                      player.play({ ...s, youtubeId: p.youtubeId, previewUrl: p.previewUrl || s.previewUrl, coverColors: s.coverColors || ["var(--primary)", "var(--highlight)"] }, songs);
                    } catch {
                      player.play({ ...s, coverColors: s.coverColors || ["var(--primary)", "var(--highlight)"] }, songs);
                    }
                  }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface/40 cursor-pointer">
                    <Cover song={s} coverUrl={s.coverUrl} size={44} square />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{s.title}</div>
                      <div className="text-xs text-muted truncate">{s.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}