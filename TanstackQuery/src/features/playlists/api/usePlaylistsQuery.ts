import { useQuery } from "@tanstack/react-query"
import { client } from "../../../shared/api/client"
import { playlistsKeys } from "../../../shared/api/keys-factories/playlistsKeysFactory"
import type { SchemaGetPlaylistsRequestPayload } from "../../../shared/api/schema"

type UsePlaylistsQueryArgs = {
    search?: string
    pageNumber: number
    pageSize?: number
    sortBy?: SchemaGetPlaylistsRequestPayload["sortBy"]
    sortDirection?: SchemaGetPlaylistsRequestPayload["sortDirection"]
}

export const usePlaylistsQuery = (userId: string | undefined, args: UsePlaylistsQueryArgs) => {
    return useQuery({
        queryKey: playlistsKeys.list({ ...args, userId }),
        queryFn: async () => {
            const response = await client.GET("/playlists", {
                params: {
                    query: {
                        pageNumber: args.pageNumber,
                        pageSize: args.pageSize ?? 10,
                        sortBy: args.sortBy ?? "addedAt",
                        sortDirection: args.sortDirection ?? "desc",
                        search: args.search || undefined,
                        userId,
                    },
                },
            })
            return response.data!
        },
    })
}

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