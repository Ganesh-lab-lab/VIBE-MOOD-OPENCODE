import React, { useState } from "react";

export default function Cover({ song, size = 64, spin = false, coverUrl, square = false }: { song: any; size?: number; spin?: boolean; coverUrl?: string; square?: boolean }) {
  const [err, setErr] = useState(false);
  const url = coverUrl || song?.coverUrl;
  const colors = song?.coverColors || ["var(--primary)", "var(--primary)"];
  const r = square ? "rounded-3xl" : "rounded-full";
  if (url && !err) {
    return (<img src={url} alt="" onError={() => setErr(true)} className={(spin ? "spinning " : "") + r + " object-cover shrink-0 bg-surface"} style={{ width: size, height: size }} />);
  }
  return (<div className={spin ? "spinning " + r + " shrink-0" : r + " shrink-0"} style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} />);
}
