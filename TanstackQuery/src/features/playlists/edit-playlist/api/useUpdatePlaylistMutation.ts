import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "../../../../shared/api/client"
import { playlistsKeys } from "../../../../shared/api/keys-factories/playlistsKeysFactory"
import type { SchemaGetPlaylistsOutput, SchemaUpdatePlaylistRequestPayload } from "../../../../shared/api/schema"

type UseUpdatePlaylistMutationArgs = {
    playlistId: string
    userId?: string
    onSuccess?: () => void
}

export const useUpdatePlaylistMutation = ({ playlistId, userId, onSuccess }: UseUpdatePlaylistMutationArgs) => {
    const queryClient = useQueryClient()
    const myPlaylistsKey = [...playlistsKeys.myList(), userId]

    return useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
            const response = await client.PUT("/playlists/{playlistId}", {
                params: { path: { playlistId } },
                body: {
                    title: data.title,
                    description: data.description || null,
                    tagIds: [],
                },
            })

            return response.data
        },

        // Optimistic update: UI обновляется мгновенно без ожидания ответа.
        onMutate: async (newData: SchemaUpdatePlaylistRequestPayload) => {
            await queryClient.cancelQueries({ queryKey: playlistsKeys.all })
            const previousMyPlaylists = queryClient.getQueryData(myPlaylistsKey)

            queryClient.setQueryData(myPlaylistsKey, (oldData: SchemaGetPlaylistsOutput) => {
                return {
                    ...oldData,
                    data: oldData.data.map((playlist) =>
                        playlist.id === playlistId
                            ? {
                                  ...playlist,
                                  attributes: {
                                      ...playlist.attributes,
                                      ...newData,
                                  },
                              }
                            : playlist,
                    ),
                }
            })

            return { previousMyPlaylists }
        },

        onError: (_error, _newData, onMutateResult) => {
            queryClient.setQueryData(myPlaylistsKey, onMutateResult?.previousMyPlaylists)
        },

        onSuccess: () => {
            onSuccess?.()
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.all,
                refetchType: "all",
            })
        },
    })
}