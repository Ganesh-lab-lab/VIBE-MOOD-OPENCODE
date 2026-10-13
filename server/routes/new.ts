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

export function newReleasesHandler(req: Request, res: Response) {
  const lang = (req.query.lang as string) || "";
  const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  let sql = "SELECT * FROM songs WHERE (releasedAt >= ? OR isNew=1)";
  const params: any[] = [cutoff];
  if (lang) { sql += " AND (language=? OR language IS NULL)"; params.push(lang); }
  sql += " ORDER BY releasedAt DESC LIMIT 60";
  const rows = db.prepare(sql).all(...params);
  const now = Date.now();
  const songs = rows.map((r: any) => ({ ...mapSong(r), justDropped: r.releasedAt && (now - new Date(r.releasedAt).getTime()) < 48 * 3600 * 1000 }));
  res.json({ songs });
}