import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type Repeat = "off" | "one" | "all";

interface PlayerCtx {
  current: any;
  queue: any[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: Repeat;
  isPreview: boolean;
  notAvailable: boolean;
  play: (song: any, queueOverride?: any[]) => void;
  toggle: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setShuffle: (b: boolean) => void;
  setRepeat: (r: Repeat) => void;
  setQueue: (q: any[]) => void;
}

const C = createContext<PlayerCtx | null>(null);

function pickNext(queue: any[], current: any, shuffle: boolean, repeat: Repeat): any | null {
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
  const [current, setCurrent] = useState<any>(null);
  const [queue, setQueueState] = useState<any[]>(() => []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<Repeat>("off");
  const [isPreview, setIsPreview] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const pollRef = useRef<number | null>(null);
  const modeRef = useRef<"sim" | "yt" | "audio" | "none">("none");

  // initialize queue from fake songs lazily
  useEffect(() => {
    import("../data/songs").then(({ songs }) => {
      if (queue.length === 0) setQueueState([...songs]);
    }).catch(() => {});
  }, []);

  const clearPoll = () => { if (pollRef.current) window.clearInterval(pollRef.current); pollRef.current = null; };

  const stopMedia = () => {
    clearPoll();
    if (audioRef.current) { try { audioRef.current.pause(); } catch {} }
    if (ytPlayerRef.current) { try { ytPlayerRef.current.stopVideo?.(); } catch {} }
  };

  const startSimTimer = (cur: any) => {
    modeRef.current = "sim";
    clearPoll();
    pollRef.current = window.setInterval(() => {
      setCurrentTime((t) => {
        const d = cur.duration || duration;
        if (t + 1 >= d) {
          const n = pickNext(queue, cur, shuffle, repeat);
          if (n) { playInternal(n, null); return 0; }
          setIsPlaying(false);
          return d;
        }
        return t + 1;
      });
    }, 1000);
  };

  function loadYT(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) { resolve(); return; }
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    });
  }

  const playInternal = async (song: any, override: any[] | null) => {
    if (override) setQueueState(override);
    stopMedia();
    setCurrent(song);
    setNotAvailable(false);
    const d = song.durationSec || song.duration || 0;
    setDuration(d);
    setCurrentTime(0);
    setIsPlaying(true);

    const hasYt = !!song.youtubeId;
    const hasPreview = !!song.previewUrl;
    setIsPreview(!hasYt && hasPreview);

    if (hasYt) {
      modeRef.current = "yt";
      try {
        await loadYT();
        if (!ytPlayerRef.current) {
          ytPlayerRef.current = new (window as any).YT.Player(ytContainerRef.current, {
            height: "200",
            width: "200",
            videoId: song.youtubeId,
            playerVars: { playsinline: 1, autoplay: 1, controls: 0 },
            events: {
              onReady: (e: any) => { try { e.target.playVideo(); } catch {} },
              onStateChange: (e: any) => {
                if (e.data === 0) {
                  const n = pickNext(queue, song, shuffle, repeat);
                  if (n) playInternal(n, null);
                  else setIsPlaying(false);
                }
              },
            },
          });
        } else {
          try { ytPlayerRef.current.loadVideoById(song.youtubeId); ytPlayerRef.current.playVideo(); } catch {}
        }
        pollRef.current = window.setInterval(() => {
          try {
            const t = ytPlayerRef.current.getCurrentTime?.();
            const du = ytPlayerRef.current.getDuration?.();
            if (typeof t === "number") setCurrentTime(t);
            if (typeof du === "number" && du > 0) setDuration(du);
          } catch {}
        }, 500);
      } catch {
        // fallback to sim if duration exists
        if (d > 0) startSimTimer(song);
        else { setNotAvailable(true); setTimeout(() => nextInternal(song), 1000); }
      }
    } else if (hasPreview) {
      modeRef.current = "audio";
      const audio = audioRef.current;
      if (audio) {
        audio.src = song.previewUrl;
        audio.onloadedmetadata = () => setDuration(audio.duration || d);
        audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
        audio.onended = () => {
          const n = pickNext(queue, song, shuffle, repeat);
          if (n) playInternal(n, null);
          else setIsPlaying(false);
        };
        try { await audio.play(); } catch { setIsPlaying(false); }
      }
    } else if (d > 0) {
      startSimTimer(song);
    } else {
      modeRef.current = "none";
      setNotAvailable(true);
      setTimeout(() => nextInternal(song), 1000);
    }
  };

  const play = (song: any, queueOverride?: any[]) => {
    playInternal(song, queueOverride || null);
  };

  const nextInternal = (cur: any) => {
    const n = pickNext(queue, cur || current, shuffle, repeat === "one" ? "off" : repeat);
    if (n) playInternal(n, null);
    else setIsPlaying(false);
  };
  const next = () => nextInternal(current);
  const prev = () => {
    if (currentTime > 3) { seek(0); return; }
    const idx = queue.findIndex((s) => s.id === current?.id);
    const p = queue[idx - 1] || queue[queue.length - 1];
    if (p) playInternal(p, null);
  };
  const toggle = () => {
    if (!current) return;
    if (isPlaying) {
      // pause
      setIsPlaying(false);
      if (modeRef.current === "audio" && audioRef.current) audioRef.current.pause();
      if (modeRef.current === "yt" && ytPlayerRef.current) ytPlayerRef.current.pauseVideo?.();
      clearPoll();
    } else {
      setIsPlaying(true);
      if (modeRef.current === "audio" && audioRef.current) audioRef.current.play().catch(() => {});
      if (modeRef.current === "yt" && ytPlayerRef.current) ytPlayerRef.current.playVideo?.();
      if (modeRef.current === "sim") startSimTimer(current);
      if (modeRef.current === "yt") {
        pollRef.current = window.setInterval(() => {
          try {
            const t = ytPlayerRef.current.getCurrentTime?.();
            const du = ytPlayerRef.current.getDuration?.();
            if (typeof t === "number") setCurrentTime(t);
            if (typeof du === "number" && du > 0) setDuration(du);
          } catch {}
        }, 500);
      }
    }
  };
  const pause = () => { if (isPlaying) toggle(); };
  const resume = () => { if (!isPlaying && current) toggle(); };
  const seek = (t: number) => {
    const clamped = Math.max(0, Math.min(duration || t, t));
    setCurrentTime(clamped);
    if (modeRef.current === "audio" && audioRef.current) audioRef.current.currentTime = clamped;
    if (modeRef.current === "yt" && ytPlayerRef.current) ytPlayerRef.current.seekTo?.(clamped, true);
  };
  const setQueue = (q: any[]) => setQueueState(q);

  // simulation timer update effect for duration changes handled internally.

  const value: PlayerCtx = {
    current, queue, isPlaying, currentTime, duration, shuffle, repeat, isPreview, notAvailable,
    play, toggle, pause, resume, next, prev, seek,
    setShuffle, setRepeat, setQueue,
  };

  return (
    <C.Provider value={value}>
      {children}
      <div style={{ position: "fixed", bottom: 0, right: 0, width: 200, height: 200, zIndex: 0, opacity: 0.01, pointerEvents: "none" }} ref={ytContainerRef} />
      <audio ref={audioRef} style={{ display: "none" }} />
    </C.Provider>
  );
}

export function usePlayer() {
  const c = useContext(C);
  if (!c) throw new Error("usePlayer outside");
  return c;
}
