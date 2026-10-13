import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "server", "vibemood.sqlite");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  durationSec INTEGER,
  coverUrl TEXT,
  previewUrl TEXT,
  youtubeId TEXT,
  releasedAt TEXT,
  isNew INTEGER DEFAULT 0,
  source TEXT,
  vibeTags TEXT
);
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  imageUrl TEXT,
  followers INTEGER
);
CREATE TABLE IF NOT EXISTS releases_seen (
  sourceId TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS search_cache (
  query TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  expiresAt INTEGER NOT NULL
);
`);
function addColumn(table: string, col: string, type: string) {
  try { db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`); } catch {}
}
addColumn("songs", "language", "TEXT");
addColumn("songs", "isFilm", "INTEGER DEFAULT 0");
addColumn("songs", "filmName", "TEXT");
addColumn("songs", "musicDirector", "TEXT");
addColumn("songs", "singers", "TEXT");
addColumn("artists", "languages", "TEXT");

export default db;