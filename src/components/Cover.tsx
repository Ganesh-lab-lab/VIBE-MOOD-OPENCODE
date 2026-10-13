import React, { useState } from "react";

export default function Cover({ song, size = 64, spin = false, coverUrl }: { song: any; size?: number; spin?: boolean; coverUrl?: string }) {
  const [err, setErr] = useState(false);
  const url = coverUrl || song?.coverUrl;
  const colors = song?.coverColors || ["var(--primary)", "var(--primary)"];
  if (url && !err) {
    return (
      <img
        src={url}
        alt=""
        onError={() => setErr(true)}
        className={(spin ? "spinning " : "") + "rounded-full object-cover shrink-0 bg-surface"}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={spin ? "spinning rounded-full shrink-0" : "rounded-full shrink-0"}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    />
  );
}