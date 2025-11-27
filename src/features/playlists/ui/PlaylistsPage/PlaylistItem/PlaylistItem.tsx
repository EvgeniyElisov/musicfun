import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types"
import { PlaylistCover } from "./PlaylistCover"
import { PlaylistDescription } from "./PlaylistDescription"

type Props = {
  playlist: PlaylistData
  deletePlaylist: (playlistId: string) => void
  editPlaylist: (playlist: PlaylistData) => void
}
 
export const PlaylistItem = ({ playlist, editPlaylist, deletePlaylist }: Props) => {
  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription attributes={playlist.attributes} />
      <button onClick={() => deletePlaylist(playlist.id)}>Удалить</button>
      <button onClick={() => editPlaylist(playlist)}>Редактировать</button>
    </div>
  )
}