import { useCreatePlaylistMutation } from "@/features/playlists/api/playlistsApi";
import type { CreatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import s from "./CreatePlaylistForm.module.css";
import { createPlaylistSchema } from "@/features/playlists/model/playlists.schemas";

export const CreatePlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistArgs>({
    resolver: zodResolver(createPlaylistSchema),
  });
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
        {errors.title && <span className={s.error}>{errors.title.message}</span>}
      </div>
      <div>
        <input {...register("description")} placeholder={"Описание"} />
        {errors.description && <span className={s.error}>{errors.description.message}</span>}
      </div>
      <button>Создать</button>
    </form>
  );
};
