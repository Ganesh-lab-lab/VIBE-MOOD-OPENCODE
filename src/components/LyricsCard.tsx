import React from "react";
import { usePlayer } from "../context/PlayerContext";
import { lyrics } from "../data/lyrics";

export default function LyricsCard({ compact = false }: { compact?: boolean }) {
  const player = usePlayer();
  const s = player.current;
  const lines = s ? (lyrics[s.id] || []) : [];
  const idx = lines.reduce((acc, l, i) => (l.time <= player.currentTime ? i : acc), 0);
  if (!s) return null;
  if (compact) {
    const cur = lines[idx]?.text || "";
    const prev = idx > 0 ? lines[idx - 1].text : "";
    const next = idx < lines.length - 1 ? lines[idx + 1].text : "";
    return (
      <div className="glass p-3">
        <div className="glass-inner text-center space-y-1">
          <div className="text-xs text-muted truncate">{prev}</div>
          <div className="text-sm font-semibold text-primary truncate">{cur}</div>
          <div className="text-xs text-muted truncate">{next}</div>
        </div>
      </div>
    );
  }
  return null;
}
