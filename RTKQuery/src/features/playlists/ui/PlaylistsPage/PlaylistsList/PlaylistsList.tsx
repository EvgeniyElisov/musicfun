import { useDeletePlaylistMutation } from "@/features/playlists/api/playlistsApi";
import { EditPlaylistForm } from "../EditPlaylistForm";
import { PlaylistItem } from "../PlaylistItem";
import s from "./PlaylistsList.module.css";
import type { PlaylistData, UpdatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types";
import { useForm } from "react-hook-form";
import { useState } from "react";

type Props = {
  playlists: PlaylistData[];
  isPlaylistsLoading: boolean;
};

export const PlaylistsList = ({ playlists, isPlaylistsLoading }: Props) => {
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  const [deletePlaylist] = useDeletePlaylistMutation();
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>();

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm("Вы уверены, что хотите удалить плейлист?")) {
      deletePlaylist(playlistId);
    }
  };

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id);
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((t) => t.id),
      });
    } else {
      setPlaylistId(null);
    }
  };

  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistsLoading && <h2>Плейлисты не найдены</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlistId === playlist.id;
        return (
          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlaylistForm
                playlistId={playlistId}
                handleSubmit={handleSubmit}
                register={register}
                editPlaylist={editPlaylistHandler}
                setPlaylistId={setPlaylistId}
              />
            ) : (
              <PlaylistItem playlist={playlist} deletePlaylist={deletePlaylistHandler} editPlaylist={editPlaylistHandler} />
            )}
          </div>
        );
      })}
    </div>
  );
};
