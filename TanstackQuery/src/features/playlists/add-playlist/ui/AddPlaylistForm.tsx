import { useForm } from "react-hook-form"
import type { SchemaCreatePlaylistRequestPayload } from "../../../../shared/api/schema"
import { useAddPlaylistMutation } from "../api/useAddPlaylistMutation"

export const AddPlaylistForm = () => {
    const { register, handleSubmit } = useForm<SchemaCreatePlaylistRequestPayload>()
    const { mutate } = useAddPlaylistMutation()

    const onSubmit = (data: SchemaCreatePlaylistRequestPayload) => {
        mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Add New Playlist</h2>
            <p>
                <input {...register("title")} />
            </p>
            {/* {errors.title && <p>{errors.title.message}</p>} */}
            <p>
                <textarea {...register("description")}></textarea>
            </p>
            {/* {errors.description && <p>{errors.description.message}</p>} */}

            <button type={"submit"}>Create</button>
            {/* {errors.root?.server && <p>{errors.root?.server.message}</p>} */}
        </form>
    )
}