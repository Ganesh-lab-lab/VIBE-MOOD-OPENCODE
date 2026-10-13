export const API = "";


export async function apiNew(lang?: string) {
  const r = await fetch(`/api/new${lang ? `?lang=${lang}` : ""}`);
  if (!r.ok) throw new Error("new failed");
  return r.json();
}
export async function apiSearch(q: string, lang?: string) {
  const r = await fetch(`/api/search?q=${encodeURIComponent(q)}${lang ? `&lang=${lang}` : ""}`);
  if (!r.ok) throw new Error("search failed");
  return r.json();
}
export async function apiPlay(songId: string) {
  const r = await fetch(`/api/play/${songId}`);
  if (!r.ok) throw new Error("play failed");
  return r.json();
}
export async function apiSongs(ids: string[]) {
  const r = await fetch(`/api/songs?ids=${ids.join(",")}`);
  if (!r.ok) throw new Error("songs failed");
  return r.json();
}
export async function apiArtist(name: string) {
  const r = await fetch(`/api/artist?name=${encodeURIComponent(name)}`);
  if (!r.ok) throw new Error("artist failed");
  return r.json();
}