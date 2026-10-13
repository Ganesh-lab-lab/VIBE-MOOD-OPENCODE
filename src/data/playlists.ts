export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  icon?: string;
  color?: string;
  createdAt: number;
}

export const initialPlaylists: Playlist[] = [
  { id: "p1", name: "Midnight Drift", songIds: ["s1", "s9", "s17", "s4", "s20"], icon: "moon", color: "#7B2FF7", createdAt: 0 },
  { id: "p2", name: "Sunlit Drive", songIds: ["s2", "s10", "s18", "s6", "s8"], icon: "sun", color: "#FF5E6C", createdAt: 0 },
  { id: "p3", name: "Focus Flow", songIds: ["s3", "s5", "s11", "s12", "s13", "s20"], icon: "zap", color: "#2FAE5F", createdAt: 0 },
  { id: "p4", name: "Heartbeats", songIds: ["s6", "s14", "s22", "s17", "s1"], icon: "heart", color: "#E8567A", createdAt: 0 },
  { id: "p5", name: "Road Trip Radio", songIds: ["s2", "s7", "s8", "s15", "s18", "s23"], icon: "road", color: "#FF7A1A", createdAt: 0 },
  { id: "p6", name: "New Drops", songIds: ["s1", "s4", "s6", "s10", "s15", "s19", "s22", "s24"], icon: "sparkles", color: "#C6FF3D", createdAt: 0 },
];
