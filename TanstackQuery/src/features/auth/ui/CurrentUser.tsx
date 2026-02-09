import { Link } from "@tanstack/react-router"
import { useMeQuery } from "../api/useMeQuery"
import { LogoutButton } from "./LogoutButton"
import styles from "./AccountBar.module.css"

export const CurrentUser = () => {
    const query = useMeQuery()

    if (!query.data) return <span>...</span>

    return (
        <div className={styles.meInfoContainer}>
            <Link to="/my-playlists" activeOptions={{ exact: true }}>
                {query.data.login} <LogoutButton />
            </Link>
        </div>
    )
}