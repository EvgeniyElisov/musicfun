import type { PlaylistAttributes } from "@/features/playlists/api/playlistsApi.types"

type Props = {
  attributes: PlaylistAttributes
}
 
export const PlaylistDescription = ({ attributes }: Props) => {
  return (
    <>
      <div>Название: {attributes.title}</div>
      <div>Описание: {attributes.description}</div>
      <div>Юзер: {attributes.user.name}</div>
    </>
  )
}