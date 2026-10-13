import fs from "node:fs";
import path from "node:path";
import db from "../db.js";
import { broadcast } from "../sse.js";
async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try { return await fn(); } catch (e) { console.warn("source failed", e); return null; }
}

function seen(sourceId: string) {
  return !!db.prepare("SELECT 1 FROM releases_seen WHERE sourceId=?").get(sourceId);
}

function markSeen(sourceId: string) {
  db.prepare("INSERT OR IGNORE INTO releases_seen(sourceId) VALUES(?)").run(sourceId);
}

function upsertSong(s: any) {
  db.prepare(`
    INSERT INTO songs (id, title, artist, album, durationSec, coverUrl, previewUrl, youtubeId, releasedAt, isNew, source, vibeTags)
    VALUES (@id, @title, @artist, @album, @durationSec, @coverUrl, @previewUrl, @youtubeId, @releasedAt, 1, @source, @vibeTags)
    ON CONFLICT(id) DO UPDATE SET title=excluded.title, artist=excluded.artist, coverUrl=excluded.coverUrl, releasedAt=excluded.releasedAt
  `).run({
    id: s.id, title: s.title, artist: s.artist, album: s.album || null,
    durationSec: s.durationSec || null, coverUrl: s.coverUrl || null,
    previewUrl: s.previewUrl || null, youtubeId: s.youtubeId || null,
    releasedAt: s.releasedAt || null, source: s.source || null,
    vibeTags: JSON.stringify([]),
  });
  const aId = "art_" + (s.artist || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  db.prepare("INSERT OR IGNORE INTO artists(id,name) VALUES(?,?)").run(aId, s.artist);
}

async function youtubeRss() {
  const file = path.join(process.cwd(), "server", "channels.json");
  if (!fs.existsSync(file)) return [];
  const channels: any[] = JSON.parse(fs.readFileSync(file, "utf8") || "[]");
  const blocked = ["trailer","teaser","reel","behind the scenes","interview","jukebox","highlights","promo"];
  const out: any[] = [];
  for (const ch of channels) {
    const id = ch.channelId || ch; // support old string entries
    const lang = ch.language || null;
    const name = ch.name || "Unknown";
    const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`).then((r) => r.text());
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    for (const m of entries) {
      const block = m[1];
      const videoId = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const title = block.match(/<title>(.*?)<\/title>/)?.[1];
      const published = block.match(/<published>(.*?)<\/published>/)?.[1];
      const author = block.match(/<name>(.*?)<\/name>/)?.[1] || name;
      if (!videoId || !title) continue;
      const tLow = title.toLowerCase();
      if (blocked.some((k) => tLow.includes(k))) continue;
      const srcId = "yt:" + videoId;
      if (seen(srcId)) continue;
      markSeen(srcId);
      out.push({
        id: "yt_" + videoId,
        title: decodeEntities(title),
        artist: author,
        album: null,
        durationSec: null,
        coverUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        previewUrl: null,
        youtubeId: videoId,
        language: lang,
        releasedAt: published || new Date().toISOString(),
        source: "youtube_rss",
      });
    }
  }
  return out;
}

function decodeEntities(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
}

async function deezerFeed() {
  // best-effort; skip if unavailable
  const r = await fetch("https://api.deezer.com/editorial/0/releases?limit=25");
  if (!r.ok) throw new Error("deezer releases " + r.status);
  const j = await r.json();
  const items = j.data || [];
  const out: any[] = [];
  for (const x of items) {
    const srcId = "dz_release:" + (x.id || x.title);
    if (seen(srcId)) continue;
    markSeen(srcId);
    out.push({
      id: "dz_" + (x.id || Date.now()),
      title: x.title,
      artist: x.artist?.name || "Unknown",
      album: x.album?.title || x.title,
      durationSec: x.duration || null,
      coverUrl: x.album?.cover_big || x.album?.cover_medium,
      previewUrl: x.preview || null,
      youtubeId: null,
      releasedAt: x.release_date ? new Date(x.release_date).toISOString() : new Date().toISOString(),
      source: "deezer",
    });
  }
  return out;
}

export async function runReleaseJob() {
  console.log("Running release job");
  // Clean isNew older than 48 hours
  const cutoff48 = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  db.prepare("UPDATE songs SET isNew=0 WHERE releasedAt < ? AND isNew=1").run(cutoff48);

  const collected: any[] = [];
  const yt = await safe(youtubeRss);
  if (yt) collected.push(...yt);
  const dz = await safe(deezerFeed);
  if (dz) collected.push(...dz);

  let inserted = 0;
  const counts: Record<string, number> = {};
  for (const s of collected) {
    try { upsertSong(s); inserted++; counts[s.language || "en"] = (counts[s.language] || 0) + 1; } catch (e) { console.warn("upsert", e); }
  }
  const langs = Object.entries(counts).map(([code, count]) => ({ code, count }));
  broadcast("new-releases", { count: inserted, langs });
  console.log("Release job done, inserted", inserted);
  return inserted;
}