import { Request, Response } from "express";
import db from "../db.js";

const DAILY_LIMIT = 9000; // keep margin under 10k
let quotaUsed = 0;
let quotaDay = new Date().toDateString();

function resetIfNeeded() {
  const today = new Date().toDateString();
  if (today !== quotaDay) { quotaDay = today; quotaUsed = 0; }
}

export async function playHandler(req: Request, res: Response) {
  const songId = req.params.songId;
  const row = db.prepare("SELECT * FROM songs WHERE id=?").get(songId) as any;
  if (!row) return res.status(404).json({ error: "not found" });

  let youtubeId = row.youtubeId;
  const previewUrl = row.previewUrl;

  if (!youtubeId && process.env.YOUTUBE_API_KEY && quotaUsed + 100 <= DAILY_LIMIT) {
    resetIfNeeded();
    try {
      const q = encodeURIComponent(`${row.artist} ${row.title}`);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&videoCategoryId=10&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`;
      const r = await fetch(url);
      const j = await r.json();
      quotaUsed += 100;
      const vid = j?.items?.[0]?.id?.videoId;
      if (vid) {
        youtubeId = vid;
        db.prepare("UPDATE songs SET youtubeId=? WHERE id=?").run(vid, songId);
      }
    } catch (e) {
      // ignore, return preview only
    }
  }

  res.json({ youtubeId: youtubeId || null, previewUrl: previewUrl || null });
}