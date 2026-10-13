import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LikesProvider } from "./context/LikesContext";
import { PlaylistsProvider } from "./context/PlaylistsContext";
import { PlayerProvider } from "./context/PlayerContext";

import { Splash } from "./pages/Splash";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { PickVibe } from "./pages/PickVibe";
import { Welcome } from "./pages/Welcome";
import Home from "./pages/Home";
import NewPage from "./pages/NewPage";
import SearchPage from "./pages/SearchPage";
import LibraryPage from "./pages/LibraryPage";
import LikedPage from "./pages/LikedPage";
import ArtistPage from "./pages/ArtistPage";
import PlaylistPage from "./pages/PlaylistPage";
import SettingsPage from "./pages/SettingsPage";
import NowPlayingPage from "./pages/NowPlayingPage";
import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LikesProvider>
          <PlaylistsProvider>
            <PlayerProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/splash" element={<Splash />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/onboard" element={<PickVibe />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="new" element={<NewPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="liked" element={<LikedPage />} />
                    <Route path="artist/:id" element={<ArtistPage />} />
                    <Route path="playlist/:id" element={<PlaylistPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="nowplaying" element={<NowPlayingPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </PlayerProvider>
          </PlaylistsProvider>
        </LikesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
