import { baseApi } from "@/app/api/baseApi"
import type { FetchTracksResponse } from "./tracksApi.types"

export const tracksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null, // начальное значение cursor
        getNextPageParam: lastPage => {
          return lastPage.meta.nextCursor || null
        },
      },
      query: ({ pageParam }) => { // сюда попадает nextCursor из 10 строки
        return {
          url: 'playlists/tracks',
          params: { cursor: pageParam, pageSize: 5, paginationType: 'cursor' },
        }
      },
    }),
  }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi