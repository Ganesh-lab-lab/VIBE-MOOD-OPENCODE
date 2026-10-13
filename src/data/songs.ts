import { artists } from "./artists";

export interface Song {
  id: string;
  title: string;
  artistId: string;
  album: string;
  duration: number; // seconds
  coverColors: [string, string];
  vibeTags: string[];
  isNew: boolean;
  plays: number;
}

export const songs: Song[] = [
  { id: "s1", title: "Midnight Carousel", artistId: "a1", album: "Velvet Hours", duration: 214, coverColors: ["#FF6B4A", "#5AA9FF"], vibeTags: ["chill","romantic"], isNew: true, plays: 9400000 },
  { id: "s2", title: "Sunset Convoy", artistId: "a2", album: "Coastline", duration: 188, coverColors: ["#F5B83D","#FF9F1C"], vibeTags: ["party","roadtrip"], isNew: false, plays: 7200000 },
  { id: "s3", title: "Quiet Mornings", artistId: "a3", album: "Paper Boats", duration: 201, coverColors: ["#2FAE5F","#C9F0A8"], vibeTags: ["chill","focus"], isNew: false, plays: 3400000 },
  { id: "s4", title: "Glass Towers", artistId: "a4", album: "Mirage", duration: 245, coverColors: ["#4FC3F7","#FF6B4A"], vibeTags: ["focus","sad"], isNew: true, plays: 11200000 },
  { id: "s5", title: "Warm Static", artistId: "a5", album: "Lo-Fi Letters", duration: 167, coverColors: ["#F26A0C","#FFD6A8"], vibeTags: ["chill","focus"], isNew: false, plays: 2900000 },
  { id: "s6", title: "Neon Heartbeat", artistId: "a6", album: "Afterglow", duration: 198, coverColors: ["#E8567A","#FF8FA3"], vibeTags: ["party","workout"], isNew: true, plays: 5800000 },
  { id: "s7", title: "Dust and Stars", artistId: "a7", album: "Horizon Line", duration: 233, coverColors: ["#5AA9FF","#0A2A2B"], vibeTags: ["sad","roadtrip"], isNew: false, plays: 1900000 },
  { id: "s8", title: "Frequency", artistId: "a8", album: "Resonance", duration: 209, coverColors: ["#7CF5C8","#FF6B4A"], vibeTags: ["workout","party"], isNew: false, plays: 8300000 },
  { id: "s9", title: "Lavender Rain", artistId: "a1", album: "Velvet Hours", duration: 192, coverColors: ["#9B59F6","#5FE0D0"], vibeTags: ["sad","chill"], isNew: false, plays: 6100000 },
  { id: "s10", title: "Barefoot Summer", artistId: "a2", album: "Coastline", duration: 176, coverColors: ["#FF7A5C","#FFD666"], vibeTags: ["party","roadtrip"], isNew: true, plays: 4500000 },
  { id: "s11", title: "Paper Cranes", artistId: "a3", album: "Paper Boats", duration: 210, coverColors: ["#3CC46A","#C6F0D2"], vibeTags: ["focus","sad"], isNew: false, plays: 2200000 },
  { id: "s12", title: "Northern Light", artistId: "a4", album: "Mirage", duration: 260, coverColors: ["#6FCFFF","#9B6CFF"], vibeTags: ["chill","focus"], isNew: false, plays: 10100000 },
  { id: "s13", title: "Afternoon Drift", artistId: "a5", album: "Lo-Fi Letters", duration: 155, coverColors: ["#FF8A2B","#FFE0C2"], vibeTags: ["chill","focus"], isNew: false, plays: 3300000 },
  { id: "s14", title: "Crimson Letters", artistId: "a6", album: "Afterglow", duration: 204, coverColors: ["#F2638A","#FFB3C2"], vibeTags: ["romantic","sad"], isNew: false, plays: 4900000 },
  { id: "s15", title: "Silver Dunes", artistId: "a7", album: "Horizon Line", duration: 248, coverColors: ["#2CE0C4","#123A34"], vibeTags: ["roadtrip","sad"], isNew: true, plays: 1700000 },
  { id: "s16", title: "Voltage", artistId: "a8", album: "Resonance", duration: 182, coverColors: ["#D4FF55","#6E3CFF"], vibeTags: ["workout","party"], isNew: false, plays: 7600000 },
  { id: "s17", title: "Echoes of You", artistId: "a1", album: "Velvet Hours", duration: 223, coverColors: ["#A070FF","#40D8C8"], vibeTags: ["romantic","sad"], isNew: false, plays: 5400000 },
  { id: "s18", title: "Highway Bloom", artistId: "a2", album: "Roadside", duration: 195, coverColors: ["#FF6B4A","#FFC27A"], vibeTags: ["roadtrip","party"], isNew: false, plays: 3800000 },
  { id: "s19", title: "Garden State", artistId: "a3", album: "Paper Boats", duration: 185, coverColors: ["#48D67A","#D8F5E2"], vibeTags: ["chill","romantic"], isNew: true, plays: 2600000 },
  { id: "s20", title: "Static Rain", artistId: "a4", album: "Mirage", duration: 238, coverColors: ["#5AB5F2","#B88CFF"], vibeTags: ["sad","focus"], isNew: false, plays: 9200000 },
  { id: "s21", title: "Golden Hour", artistId: "a5", album: "Lo-Fi Letters", duration: 172, coverColors: ["#FFA040","#FFF0D8"], vibeTags: ["chill","romantic"], isNew: false, plays: 4100000 },
  { id: "s22", title: "Velvet & Vine", artistId: "a6", album: "Afterglow", duration: 207, coverColors: ["#E04070","#FFA8BC"], vibeTags: ["romantic","chill"], isNew: true, plays: 3900000 },
  { id: "s23", title: "Open Road", artistId: "a7", album: "Horizon Line", duration: 255, coverColors: ["#20C8A8","#0D2A24"], vibeTags: ["roadtrip","chill"], isNew: false, plays: 1500000 },
  { id: "s24", title: "Pulsewave", artistId: "a8", album: "Resonance", duration: 190, coverColors: ["#C8FF40","#8A4DFF"], vibeTags: ["workout","party"], isNew: true, plays: 6900000 },
];

export function artistById(id: string) {
  return artists.find((a) => a.id === id)!;
}
