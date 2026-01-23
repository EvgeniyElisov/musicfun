import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { client } from "../shared/api/client"
import { useState, type ChangeEvent } from "react"
import { Pagination } from "../shared/ui/Pagination/Pagination"

export const Playlists = () => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    const query = useQuery({
        queryKey: ["playlists", { page, search }],
        queryFn: async ({ signal }) => {
            const response = await client.GET("/playlists", {
                params: {
                    query: {
                        pageNumber: page,
                        search,
                    },
                },
                signal,
            })
            if (response.error) {
                throw (response as unknown as { error: Error }).error
            }
            return response.data
        },
        placeholderData: keepPreviousData,
    })

    if (query.isPending) return <span>Loading...</span>
    if (query.isFetching) return <span>Fetching...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
            <div>
                <input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
                    placeholder={"search..."}
                />
            </div>
            <hr />
            <Pagination
                pagesCount={query.data.meta.pagesCount}
                currentPage={page}
                onPageNumberChange={setPage}
                isFetching={query.isFetching}
            />
            <ul>
                {query.data?.data.map((playlist) => (
                    <li>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}
