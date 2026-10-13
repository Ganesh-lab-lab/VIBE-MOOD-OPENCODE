import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { searchHandler } from "./routes/search.js";
import { newReleasesHandler } from "./routes/new.js";
import { songsHandler, artistHandler } from "./routes/songs.js";
import { playHandler } from "./routes/play.js";
import { runReleaseJob } from "./jobs/releases.js";
import { sseHandler, broadcast } from "./sse.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/search", searchHandler as any);
app.get("/api/new", newReleasesHandler as any);
app.get("/api/songs", songsHandler as any);
app.get("/api/artist/:id", artistHandler as any);
app.get("/api/play/:songId", playHandler as any);
app.get("/api/stream", sseHandler as any);

const port = Number(process.env.PORT || 5174);
app.listen(port, () => {
  console.log(`Vibemood API on http://localhost:${port}`);
  runReleaseJob().catch((e) => console.error("release job", e));
  cron.schedule("*/30 * * * *", () => runReleaseJob().catch((e) => console.error("release job", e)));
});

export { broadcast };