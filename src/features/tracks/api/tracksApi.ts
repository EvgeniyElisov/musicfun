import { baseApi } from "@/app/api/baseApi";
import type { FetchTracksResponse } from "./tracksApi.types";

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
          return lastPageParam < (lastPage.meta as { pagesCount: number }).pagesCount
            ? lastPageParam + 1
            : undefined
        },
      },
      query: ({ pageParam }) => {
        return {
          url: 'playlists/tracks',
          params: { pageNumber: pageParam, pageSize: 10, paginationType: 'offset' },
        }
      },
    }),
    // Offset pagination
    
    // fetchTracks: build.infiniteQuery<FetchTracksResponse, void, number>({
    //   infiniteQueryOptions: {
    //     initialPageParam: 1,
    //     getNextPageParam: (lastPage, _allPages, lastPageParam) => {
    //       return lastPageParam <
    //         (lastPage.meta as { pagesCount: number }).pagesCount
    //         ? lastPageParam + 1
    //         : undefined;
    //     },
    //   },
    //   query: ({ pageParam }) => {
    //     return {
    //       url: "playlists/tracks",
    //       params: {
    //         pageNumber: pageParam,
    //         pageSize: 10,
    //         paginationType: "offset",
    //       },
    //     };
    //   },
    // }),
  }),
});
export const { useFetchTracksInfiniteQuery } = tracksApi;
