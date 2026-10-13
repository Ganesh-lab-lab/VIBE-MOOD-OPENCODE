import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { songs } from "../data/songs";
import type { Song } from "../data/songs";

type Repeat = "off" | "one" | "all";

interface PlayerCtx {
  current: Song | null;
  queue: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: Repeat;
  play: (song: Song, queueOverride?: Song[]) => void;
  toggle: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setShuffle: (b: boolean) => void;
  setRepeat: (r: Repeat) => void;
  setQueue: (q: Song[]) => void;
  // adapter point
  adapter: { ready: boolean };
}

const C = createContext<PlayerCtx | null>(null);

function pickNext(queue: Song[], current: Song | null, shuffle: boolean, repeat: Repeat): Song | null {
  if (!current) return queue[0] || null;
  const idx = queue.findIndex((s) => s.id === current.id);
  if (repeat === "one") return current;
  if (shuffle) {
    const others = queue.filter((s) => s.id !== current.id);
    if (others.length === 0) return current;
    return others[Math.floor(Math.random() * others.length)];
  }
  let nextIdx = idx + 1;
  if (nextIdx >= queue.length) {
    if (repeat === "all") nextIdx = 0; else return null;
  }
  return queue[nextIdx] || null;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Song | null>(null);
  const [queue, setQueueState] = useState<Song[]>(() => [...songs]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<Repeat>("off");
  const adapter = useRef({ ready: false });

  // ADAPTER POINT: YouTube IFrame Player API can plug in here.
  // When adapter.ready becomes true, delegate play/pause/seek to the iframe player.
  // For now we simulate with a timer.

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (current) {
      setDuration(current.duration);
      setCurrentTime(0);
    }
  }, [current]);

  useEffect(() => {
    if (!isPlaying || !current) { if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = null; return; }
    timerRef.current = window.setInterval(() => {
      setCurrentTime((t) => {
        if (t + 1 >= duration) {
          // auto-advance
          const n = pickNext(queue, current, shuffle, repeat);
          if (n) {
            setCurrent(n);
            return 0;
          }
          setIsPlaying(false);
          return duration;
        }
        return t + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [isPlaying, current, duration, queue, shuffle, repeat]);

  const play = (song: Song, queueOverride?: Song[]) => {
    if (queueOverride) setQueueState(queueOverride);
    setCurrent(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };
  const toggle = () => { if (current) setIsPlaying((p) => !p); };
  const pause = () => setIsPlaying(false);
  const resume = () => { if (current) setIsPlaying(true); };
  const next = () => {
    const n = pickNext(queue, current, shuffle, repeat === "one" ? "off" : repeat);
    if (n) { setCurrent(n); setIsPlaying(true); }
  };
  const prev = () => {
    if (currentTime > 3) { setCurrentTime(0); return; }
    const idx = queue.findIndex((s) => s.id === current?.id);
    const p = queue[idx - 1] || queue[queue.length - 1];
    if (p) { setCurrent(p); setIsPlaying(true); }
  };
  const seek = (t: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, t)));
  };
  const setQueue = (q: Song[]) => setQueueState(q);

  const value: PlayerCtx = {
    current, queue, isPlaying, currentTime, duration, shuffle, repeat,
    play, toggle, pause, resume, next, prev, seek,
    setShuffle, setRepeat: setRepeat, setQueue,
    adapter: adapter.current,
  };

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function usePlayer() {
  const c = useContext(C);
  if (!c) throw new Error("usePlayer outside");
  return c;
}
