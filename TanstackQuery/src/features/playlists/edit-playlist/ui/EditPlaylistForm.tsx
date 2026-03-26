import { useForm } from "react-hook-form"
import type { SchemaUpdatePlaylistRequestPayload } from "../../../../shared/api/schema.ts"
import { useEffect } from "react"
import { useMeQuery } from "../../../auth/api/useMeQuery.ts"
import { usePlaylistQuery } from "../../api/usePlaylistsQuery.ts"
import { useUpdatePlaylistMutation } from "../api/useUpdatePlaylistMutation"

type Props = {
    playlistId: string | null,
    onCancelEditing: () => void
}

export const EditPlaylistForm = ({ playlistId, onCancelEditing }: Props) => {

    const { register, handleSubmit, reset } = useForm<SchemaUpdatePlaylistRequestPayload>()
    const { data: meData } = useMeQuery()
    const { data, isPending, isError } = usePlaylistQuery(playlistId)
    const { mutate } = useUpdatePlaylistMutation({
        playlistId: playlistId ?? "",
        userId: meData?.userId,
        onSuccess: onCancelEditing,
    })

    const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
        mutate(data)
    }

    useEffect(() => {
        reset()
    }, [playlistId, reset])

    if (!playlistId) return <></>
    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error...</div>

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Edit Playlist</h2>
            <p>
                <input {...register("title")} defaultValue={data?.data.attributes.title} />
            </p>
            {/* {errors.title && <p>{errors.title.message}</p>} */}
            <p>
                <textarea {...register("description")} defaultValue={data?.data.attributes.description || ""}></textarea>
            </p>
            {/* {errors.description && <p>{errors.description.message}</p>} */}

            <button type={"submit"}>Edit</button>
            {/* {errors.root?.server && <p>{errors.root?.server.message}</p>} */}
        </form>
    )
}
