import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { initialPlaylists } from "../data/playlists";
import type { Playlist } from "../data/playlists";

interface Ctx {
  playlists: Playlist[];
  create: (name: string, icon?: string, color?: string) => Playlist;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  addSong: (playlistId: string, songId: string) => void;
  removeSong: (playlistId: string, songId: string) => void;
  reorder: (playlistId: string, from: number, to: number) => void;
  contains: (playlistId: string, songId: string) => boolean;
}

const C = createContext<Ctx | null>(null);

export function PlaylistsProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const raw = localStorage.getItem("vibemood_playlists");
      if (raw) return JSON.parse(raw);
    } catch {}
    return initialPlaylists;
  });

  useEffect(() => {
    localStorage.setItem("vibemood_playlists", JSON.stringify(playlists));
  }, [playlists]);

  const create = useCallback((name: string, icon?: string, color?: string) => {
    const pl: Playlist = { id: "pl_" + Date.now() + "_" + Math.random().toString(36).slice(2), name, songIds: [], icon, color: color || "#7B2FF7", createdAt: Date.now() };
    setPlaylists((p) => [pl, ...p]);
    return pl;
  }, []);

  const rename = useCallback((id: string, name: string) => {
    setPlaylists((p) => p.map((x) => (x.id === id ? { ...x, name } : x)));
  }, []);

  const remove = useCallback((id: string) => {
    setPlaylists((p) => p.filter((x) => x.id !== id));
  }, []);

  const addSong = useCallback((playlistId: string, songId: string) => {
    setPlaylists((p) => p.map((x) => {
      if (x.id !== playlistId) return x;
      if (x.songIds.includes(songId)) return x;
      return { ...x, songIds: [...x.songIds, songId] };
    }));
  }, []);

  const removeSong = useCallback((playlistId: string, songId: string) => {
    setPlaylists((p) => p.map((x) => x.id === playlistId ? { ...x, songIds: x.songIds.filter((s) => s !== songId) } : x));
  }, []);

  const reorder = useCallback((playlistId: string, from: number, to: number) => {
    setPlaylists((p) => p.map((x) => {
      if (x.id !== playlistId) return x;
      const arr = [...x.songIds];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...x, songIds: arr };
    }));
  }, []);

  const contains = useCallback((playlistId: string, songId: string) => {
    const pl = playlists.find((p) => p.id === playlistId);
    return !!pl && pl.songIds.includes(songId);
  }, [playlists]);

  return <C.Provider value={{ playlists, create, rename, remove, addSong, removeSong, reorder, contains }}>{children}</C.Provider>;
}

export function usePlaylists() {
  const c = useContext(C);
  if (!c) throw new Error("usePlaylists outside provider");
  return c;
}
