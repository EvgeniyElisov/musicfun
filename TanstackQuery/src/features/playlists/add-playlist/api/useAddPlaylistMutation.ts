import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "../../../../shared/api/client"
import type { SchemaCreatePlaylistRequestPayload } from "../../../../shared/api/schema"
import { playlistsKeys } from "../../../../shared/api/keys-factories/playlistsKeysFactory"

export const useAddPlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
            const response = await client.POST("/playlists", {
                body: data,
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.all,
                refetchType: "all",
            })
        },
    })
}