import { baseApi } from "@/app/api/baseApi";
import { imagesSchema } from "@/common/schemas/schemas";
import type { Images } from "@/common/types";
import { withZodCatch } from "@/common/utils";
import { playlistCreateResponseSchema, playlistsResponseSchema } from "../model/playlists.schemas";
import type { CreatePlaylistArgs, FetchPlaylistsArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs } from "./playlistsApi.types";

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
    //   query: (params) => ({ url: `playlists`, params }),
    // когда происходит валидация с помощью Zod, то в build.query тип для респонса можно не указывать,
    // а тип для параметров можно передать в query: (params: type)
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: `playlists`, params }),
      ...withZodCatch(playlistsResponseSchema),
      providesTags: ["Playlist"],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        url: "playlists",
        method: "post",
        body,
      }),
      ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ["Playlist"],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        url: `playlists/${playlistId}`,
        method: "delete",
      }),
      invalidatesTags: ["Playlist"],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({
        url: `playlists/${playlistId}`,
        method: "put",
        body,
      }),

      async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), "fetchPlaylists");

        const patchResults: any[] = [];

        args.forEach((arg) => {
          patchResults.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                "fetchPlaylists",
                {
                  pageNumber: arg.pageNumber,
                  pageSize: arg.pageSize,
                  search: arg.search,
                },
                (state) => {
                  const index = state.data.findIndex((playlist) => playlist.id === playlistId);
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body };
                  }
                }
              )
            )
          );
        });

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo();
          });
        }
      },
      invalidatesTags: ["Playlist"],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `playlists/${playlistId}/images/main`,
          method: "post",
          body: formData,
        };
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ["Playlist"],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({
        url: `playlists/${playlistId}/images/main`,
        method: "delete",
      }),
      invalidatesTags: ["Playlist"],
    }),
  }),
});

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi;
