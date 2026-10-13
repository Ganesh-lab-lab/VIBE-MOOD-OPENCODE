import React from "react";

export default function Cover({ song, size = 64, spin = false }: { song: any; size?: number; spin?: boolean }) {
  return (
    <div
      className={spin ? "spinning rounded-full shrink-0" : "rounded-full shrink-0"}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${song.coverColors[0]}, ${song.coverColors[1]})` }}
    />
  );
}
