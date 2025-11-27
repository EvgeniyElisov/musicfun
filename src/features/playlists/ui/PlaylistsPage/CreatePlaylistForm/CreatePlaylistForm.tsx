import { useCreatePlaylistMutation } from "@/features/playlists/api/playlistsApi";
import type { CreatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types";
import { useForm, type SubmitHandler } from "react-hook-form";

export const CreatePlaylistForm = () => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>();
  const [createPlaylist] = useCreatePlaylistMutation();

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    createPlaylist(data)
      .unwrap()
      .then(() => {
        reset();
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать новый плейлист</h2>
      <div>
        <input {...register("title")} placeholder={"Название"} />
      </div>
      <div>
        <input {...register("description")} placeholder={"Описание"} />
      </div>
      <button>Создать</button>
    </form>
  );
};
