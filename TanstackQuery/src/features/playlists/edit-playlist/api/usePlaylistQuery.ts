import { useQuery } from "@tanstack/react-query"
import { client } from "../../../../shared/api/client"
import { playlistsKeys } from "../../../../shared/api/keys-factories/playlistsKeysFactory"

export const usePlaylistQuery = (playlistId: string | null) => {
    return useQuery({
        queryKey: playlistsKeys.detail(playlistId!),
        queryFn: async () => {
            const response = await client.GET("/playlists/{playlistId}", {
                params: { path: { playlistId: playlistId! } },
            })
            return response.data!
        },
        enabled: !!playlistId,
    })
}
