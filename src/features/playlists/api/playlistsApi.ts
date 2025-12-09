import { baseApi } from "@/app/api/baseApi";
import { SOCKET_EVENTS } from "@/common/constants";
import { imagesSchema } from "@/common/schemas/schemas";
import { subscribeToEvent } from "@/common/socket/subscribeToEvent";
import type { Images } from "@/common/types";
import { withZodCatch } from "@/common/utils";
import { playlistCreateResponseSchema, playlistsResponseSchema } from "../model/playlists.schemas";
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistData,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from "./playlistsApi.types";

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
    //   query: (params) => ({ url: `playlists`, params }),
    // когда происходит валидация с помощью Zod, то в build.query тип для респонса можно не указывать,
    // а тип для параметров можно передать в query: (params: type)
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: `playlists`, params }),
      ...withZodCatch(playlistsResponseSchema),
      keepUnusedDataFor: 0, // 👈 очистка сразу после размонтирования
      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Ждем разрешения начального запроса перед продолжением
        await cacheDataLoaded;

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
            const newPlaylist = msg.payload.data;
            updateCachedData((state) => {
              state.data.pop();
              state.data.unshift(newPlaylist);
              state.meta.totalCount = state.meta.totalCount + 1;
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize);
            });
          }),
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
            const newPlaylist = msg.payload.data;
            updateCachedData((state) => {
              const index = state.data.findIndex((playlist) => playlist.id === newPlaylist.id);
              if (index !== -1) {
                state.data[index] = { ...state.data[index], ...newPlaylist };
              }
            });
          }),
        ];

        // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
        await cacheEntryRemoved;
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      },
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
