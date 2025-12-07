import { useUpdatePlaylistMutation } from "@/features/playlists/api/playlistsApi";
import type { UpdatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types";
import type {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

type Props = {
  playlistId: string;
  register: UseFormRegister<UpdatePlaylistArgs>;
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>;
  editPlaylist: (playlist: null) => void;
  setPlaylistId: (playlistId: null) => void;
};

export const EditPlaylistForm = ({
  playlistId,
  handleSubmit,
  register,
  editPlaylist,
  setPlaylistId,
}: Props) => {
  const [updatePlaylist] = useUpdatePlaylistMutation();

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!playlistId) return;
    updatePlaylist({ playlistId, body: data });
    setPlaylistId(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <div>
        <input {...register("title")} placeholder={"Название"} />
      </div>
      <div>
        <input {...register("description")} placeholder={"Описание"} />
      </div>
      <button type={"submit"}>Сохранить</button>
      <button type={"button"} onClick={() => editPlaylist(null)}>
        Отмена
      </button>
    </form>
  );
};
