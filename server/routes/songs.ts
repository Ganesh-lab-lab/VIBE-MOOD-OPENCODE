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

export function artistHandler(req: Request, res: Response) {
  const id = req.params.id;
  // derive artist name? use artists table
  const art = db.prepare("SELECT * FROM artists WHERE id=?").get(id) as any;
  const namePattern = art ? art.name : id;
  // songs where artist matches
  const rows = db.prepare("SELECT * FROM songs WHERE artist=? ORDER BY releasedAt DESC LIMIT 40").all(art?.name || "");
  // fallback: search by id-derived? if none, return empty
  const songs = rows.map(mapSong);
  res.json({ artist: art || { id, name: id }, songs });
}