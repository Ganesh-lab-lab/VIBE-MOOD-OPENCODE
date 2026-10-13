export type RawSong = { id: string; title: string; artist: string; album?: string; durationSec?: number; coverUrl?: string; previewUrl?: string; releasedAt?: string; source: string; language?: string | null };

export async function itunesSearch(q: string, limit = 20, country = "IN"): Promise<RawSong[]> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&country=${country}&limit=${limit}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("itunes " + r.status);
  const j = await r.json();
  return (j.results || []).map((x: any) => ({
    id: "it_" + x.trackId,
    title: x.trackName,
    artist: x.artistName,
    album: x.collectionName,
    durationSec: Math.round((x.trackTimeMillis || 0) / 1000),
    coverUrl: (x.artworkUrl100 || "").replace("100x100bb", "500x500bb"),
    previewUrl: x.previewUrl,
    releasedAt: x.releaseDate,
    source: "itunes",
    language: null,
  }));
}

export async function itunesSearchMulti(q: string, limit = 20): Promise<RawSong[]> {
  const seen = new Set<string>();
  const out: RawSong[] = [];
  for (const c of ["IN", "US"]) {
    try {
      const r = await itunesSearch(q, limit, c);
      for (const s of r) if (!seen.has(s.id)) { seen.add(s.id); out.push(s); }
    } catch {}
  }
  return out;
}

export async function deezerSearch(q: string, limit = 20): Promise<RawSong[]> {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("deezer " + r.status);
  const j = await r.json();
  return (j.data || []).map((x: any) => ({
    id: "dz_" + x.id,
    title: x.title,
    artist: x.artist?.name,
    album: x.album?.title,
    durationSec: x.duration,
    coverUrl: x.album?.cover_big || x.album?.cover_medium,
    previewUrl: x.preview,
    releasedAt: new Date().toISOString(),
    source: "deezer",
    language: null,
  }));
}