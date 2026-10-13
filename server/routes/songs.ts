import { Request, Response } from "express";
import db from "../db.js";

function mapSong(r: any) {
  return {
    id: r.id,
    title: r.title,
    artist: r.artist,
    artistId: "art_" + (r.artist || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    album: r.album,
    durationSec: r.durationSec,
    coverUrl: r.coverUrl,
    previewUrl: r.previewUrl,
    youtubeId: r.youtubeId,
    releasedAt: r.releasedAt,
    isNew: !!r.isNew,
    source: r.source,
    vibeTags: r.vibeTags ? JSON.parse(r.vibeTags) : [],
    language: r.language || null, isFilm: !!r.isFilm, filmName: r.filmName,
    musicDirector: r.musicDirector,
    singers: r.singers ? JSON.parse(r.singers) : [],
  };
}

export function songsHandler(req: Request, res: Response) {
  const ids = String(req.query.ids || "").split(",").filter(Boolean);
  if (!ids.length) return res.json({ songs: [] });
  const placeholders = ids.map(() => "?").join(",");
  const rows = db.prepare(`SELECT * FROM songs WHERE id IN (${placeholders})`).all(...ids);
  res.json({ songs: rows.map(mapSong) });
}

export async function artistHandler(req: Request, res: Response) {
  const name = String(req.query.name || req.params.id || "").trim();
  if (!name) return res.json({ artist: { name: "" }, songs: [], albums: [] });
  // top songs from DB first
  let rows = db.prepare("SELECT * FROM songs WHERE artist=? ORDER BY releasedAt DESC LIMIT 25").all(name) as any[];
  if (!rows.length) {
    // search iTunes/Deezer
    try {
      const { itunesSearchMulti, deezerSearch } = await import("../itunes.js");
      const r = await itunesSearchMulti(name, 25);
      const dz = await deezerSearch(name, 25).catch(() => []);
      const all = [...r, ...dz];
      for (const s of all) {
        // upsert minimal by reusing search upsert? Just insert
        db.prepare("INSERT OR IGNORE INTO songs(id,title,artist,album,durationSec,coverUrl,previewUrl,releasedAt,source,vibeTags,language) VALUES(?,?,?,?,?,?,?,?,?,?,?)").run(s.id,s.title,s.artist,s.album||null,s.durationSec||null,s.coverUrl||null,s.previewUrl||null,s.releasedAt||null,s.source||null,"[]",null);
      }
      rows = db.prepare("SELECT * FROM songs WHERE artist=? ORDER BY releasedAt DESC LIMIT 25").all(name) as any[];
    } catch { rows = []; }
  }
  const songs = rows.map(mapSong);
  const albums = Array.from(new Set(songs.map((s:any)=>s.album))).filter(Boolean).map((a:any)=>({ name: a }));
  const coverUrl = songs[0]?.coverUrl || null;
  res.json({ artist: { id: name, name, imageUrl: coverUrl }, songs, albums, coverUrl });
}