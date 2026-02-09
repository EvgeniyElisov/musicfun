import { Navigate } from "@tanstack/react-router"
import { useMeQuery } from "../features/auth/api/useMeQuery"
import { Playlists } from "../features/Playlists"

export function MyPlaylistsPage() {
    const { data, isPending } = useMeQuery()

    if (isPending) return <div>Loading...</div>

    if (!data) {
        return <Navigate to="/" replace />
    }

    return (
        <div>
            <h2>My Playlists</h2>
            <Playlists userId={data.userId} />
        </div>
    )
}