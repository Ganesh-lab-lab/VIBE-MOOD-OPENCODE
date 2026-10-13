import { Request, Response } from "express";
import db from "../db.js";
import { itunesSearchMulti, deezerSearch } from "../itunes.js";
import { detectLanguage } from "../lang.js";

function upsertSong(s: any) {
  const lang = detectLanguage({ explicit: s.language, title: s.title }) || null;
  const stmt = db.prepare(`
    INSERT INTO songs (id, title, artist, album, durationSec, coverUrl, previewUrl, releasedAt, isNew, source, vibeTags, language, isFilm, filmName, musicDirector, singers)
    VALUES (@id, @title, @artist, @album, @durationSec, @coverUrl, @previewUrl, @releasedAt, 0, @source, @vibeTags, @language, 0, NULL, NULL, '[]')
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title, artist=excluded.artist, album=excluded.album,
      durationSec=excluded.durationSec, coverUrl=excluded.coverUrl,
      previewUrl=excluded.previewUrl, releasedAt=COALESCE(songs.releasedAt, excluded.releasedAt),
      language=COALESCE(songs.language, excluded.language)
  `);
  stmt.run({
    id: s.id, title: s.title, artist: s.artist, album: s.album || null,
    durationSec: s.durationSec || null, coverUrl: s.coverUrl || null,
    previewUrl: s.previewUrl || null, releasedAt: s.releasedAt || null,
    source: s.source || null, vibeTags: JSON.stringify([]), language: lang,
  });
  const aId = "art_" + (s.artist || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  db.prepare("INSERT OR IGNORE INTO artists(id,name,languages) VALUES(?,?,?)").run(aId, s.artist, JSON.stringify(lang ? [lang] : []));
}

function mapSong(r: any) {
  return {
    id: r.id, title: r.title, artist: r.artist,
    artistId: "art_" + (r.artist || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    album: r.album, durationSec: r.durationSec, coverUrl: r.coverUrl,
    previewUrl: r.previewUrl, youtubeId: r.youtubeId, releasedAt: r.releasedAt,
    isNew: !!r.isNew, source: r.source,
    vibeTags: r.vibeTags ? JSON.parse(r.vibeTags) : [],
    language: r.language || null, isFilm: !!r.isFilm, filmName: r.filmName,
    musicDirector: r.musicDirector,
    singers: r.singers ? JSON.parse(r.singers) : [],
  };
}

export async function searchHandler(req: Request, res: Response) {
  const q = String(req.query.q || "").trim();
  const lang = (req.query.lang as string) || "";
  const cacheKey = q + "::" + lang;
  if (!q) return res.json({ songs: [], artists: [], albums: [] });

  const row = db.prepare("SELECT payload, expiresAt FROM search_cache WHERE query=?").get(cacheKey) as any;
  const now = Date.now();
  if (row && row.expiresAt > now) return res.json(JSON.parse(row.payload));

  let results: any[] = [];
  try { results = await itunesSearchMulti(q); } catch {}
  try { const dz = await deezerSearch(q); results = [...results, ...dz]; } catch {}
  // romanized fallback
  if (results.length < 5 && /^[A-Za-z\s]+$/.test(q)) {
    const langs = lang ? [lang] : ["te", "hi", "ta"];
    // simple names
    const names: Record<string,string> = { te: "Telugu", hi: "Hindi", ta: "Tamil", ml: "Malayalam", kn: "Kannada" };
    for (const l of langs) {
      try {
        const extra = await itunesSearchMulti(`${q} ${names[l] || ""} song`, 10);
        results = [...results, ...extra];
      } catch {}
    }
  }

  // dedupe by id
  const seen = new Set<string>();
  results = results.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)));

  for (const s of results) upsertSong(s);

  let songsRows = results.map((s) => db.prepare("SELECT * FROM songs WHERE id=?").get(s.id));
  if (lang) songsRows = songsRows.filter((r: any) => !r.language || r.language === lang);

  const artistNames = Array.from(new Set(songsRows.map((r: any) => r.artist)));
  const artists = artistNames.map((name) => ({ id: "art_" + String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-"), name }));
  const albums = Array.from(new Set(songsRows.map((r: any) => r.album))).filter(Boolean).map((a) => ({ name: a }));

  const payload = { songs: songsRows.map(mapSong), artists, albums };
  db.prepare("INSERT OR REPLACE INTO search_cache(query,payload,expiresAt) VALUES(?,?,?)").run(cacheKey, JSON.stringify(payload), now + 24 * 3600 * 1000);
  res.json(payload);
}