import { ProfilePage } from "@/features/auth/ui/ProfilePage";
import { PlaylistsPage } from "@/features/playlists/ui";
import { TracksPage } from "@/features/tracks/ui";
import { Route, Routes } from "react-router";
import { PageNotFound } from "../components";
import { MainPage } from "@/app/ui";
import { OAuthCallback } from "@/features/auth/ui/OAuthCallback";

export const Path = {
  Main: "/",
  Playlists: "/playlists",
  Tracks: "/tracks",
  Profile: "/profile",
  OAuthRedirect: "/oauth/callback",
  NotFound: "*",
} as const;

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
);
