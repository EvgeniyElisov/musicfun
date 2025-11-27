import { Pagination } from "@/common/components";
import { useDebounceValue } from "@/common/hooks";
import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import {
  useDeletePlaylistMutation,
  useFetchPlaylistsQuery,
} from "../../api/playlistsApi";
import type {
  PlaylistData,
  UpdatePlaylistArgs,
} from "../../api/playlistsApi.types";
import { CreatePlaylistForm } from "./CreatePlaylistForm";
import { EditPlaylistForm } from "./EditPlaylistForm";
import { PlaylistItem } from "./PlaylistItem";
import s from "./PlaylistsPage.module.css";

export const PlaylistsPage = () => {
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounceValue(search);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  });

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>();

  const [deletePlaylist] = useDeletePlaylistMutation();

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

  const changePageSizeHandler = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input
        type="search"
        placeholder={"Поиск плейлиста по названию"}
        onChange={searchPlaylistHandler}
      />
      <div className={s.items}>
        {!data?.data.length && !isLoading && <h2>Плейлисты не найдены</h2>}
        {data?.data.map((playlist) => {
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
                <PlaylistItem
                  playlist={playlist}
                  deletePlaylist={deletePlaylistHandler}
                  editPlaylist={editPlaylistHandler}
                />
              )}
            </div>
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  );
};
