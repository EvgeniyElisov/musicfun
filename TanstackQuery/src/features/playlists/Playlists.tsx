import { useState } from "react"
import { Pagination } from "../../shared/ui/Pagination/Pagination"
import { DeletePlaylist } from "./delete-playlist/ui/DeletePlaylist"
import { usePlaylistsQuery } from "./api/usePlaylistsQuery"

 type Props = {
  userId?: string
  onPlaylistSelected?: (playlistId: string) => void
  onPlaylistDeleted?: (playlistId: string) => void
  isSearchActive?: boolean
}
 
export const Playlists = ({
  userId,
  onPlaylistSelected,
  onPlaylistDeleted,
  isSearchActive,
}: Props) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState("")
 
  const query = usePlaylistsQuery(userId, { search, pageNumber })

  const handleSelectPlaylistClick = (playlistId: string) => {
    onPlaylistSelected?.(playlistId)
  }
 
  const handleDeletePlaylist = (playlistId: string) => {
    onPlaylistDeleted?.(playlistId)
  }
 
  if (query.isPending) return <span>Loading...</span>
  if (query.isError) return <span>Error: {JSON.stringify(query.error.message)}</span>
 
  return (
    <div>
      {isSearchActive && (
        <>
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder={"search..."}
            />
          </div>
          <hr />
        </>
      )}
 
      <Pagination
        pagesCount={query.data.meta.pagesCount}
        currentPage={pageNumber}
        onPageNumberChange={setPageNumber}
        isFetching={query.isFetching}
      />
      <ul>
        {query.data.data.map((playlist) => (
          <li key={playlist.id}>
            <button type="button" onClick={() => handleSelectPlaylistClick(playlist.id)}>
              {playlist.attributes.title}
            </button>{" "}
            <DeletePlaylist playlistId={playlist.id} onDeleted={handleDeletePlaylist} />
          </li>
        ))}
      </ul>
    </div>
  )
}