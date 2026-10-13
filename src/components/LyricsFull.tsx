import React, { useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";
import { lyrics } from "../data/lyrics";

export default function LyricsFull({ compact = false }: { compact?: boolean }) {
  const player = usePlayer();
  const s = player.current;
  const lines = s ? (lyrics[s.id] || []) : [];
  const ref = useRef<HTMLDivElement>(null);
  const idx = lines.reduce((acc, l, i) => (l.time <= player.currentTime ? i : acc), 0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current.querySelector(`[data-idx="${idx}"]`);
    if (el) (el as HTMLElement).scrollIntoView({ block: "center", behavior: "smooth" });
  }, [idx]);

  if (!s || lines.length === 0) return <div className="text-muted text-sm">No lyrics available.</div>;

  return (
    <div ref={ref} className={"space-y-2 overflow-y-auto " + (compact ? "max-h-40" : "max-h-80")}>
      {lines.map((l, i) => {
        const active = i === idx;
        const isPrev = i === idx - 1;
        const isNext = i === idx + 1;
        return (
          <button
            key={i}
            data-idx={i}
            onClick={() => player.seek(l.time)}
            className={"block w-full text-left px-2 py-1 rounded " + (active ? "text-primary font-bold text-base" : (isPrev || isNext ? "text-muted text-sm" : "text-muted/60 text-sm"))}
          >
            {l.text}
          </button>
        );
      })}
    </div>
  );
}
