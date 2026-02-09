import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { client } from "../shared/api/client"
import { useState, type ChangeEvent } from "react"
import { Pagination } from "../shared/ui/Pagination/Pagination"

type Props = {
    userId?: string
  }

export const Playlists = ({ userId }: Props) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    const query = useQuery({
        queryKey: ["playlists", { page, search, userId }],
        queryFn: async ({ signal }) => {
            const response = await client.GET("/playlists", {
                params: {
                    query: {
                        pageNumber: page,
                        search,
                        userId,
                    },
                },
                // AbortSignal для отмены запроса при размонтировании компонента или при изменении queryKey
                // React Query автоматически передает signal, который позволяет прервать запрос, если он стал неактуальным
                // Пример: пользователь быстро меняет страницу с 1 на 2, затем на 3 - запрос для страницы 2 будет отменен,
                // так как queryKey изменился и запрос для страницы 3 стал приоритетным
                signal,
            })
            if (response.error) {
                throw (response as unknown as { error: Error }).error
            }
            return response.data
        },
        // Сохраняет предыдущие данные во время загрузки новых, предотвращая "мигание" при пагинации
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
