import { useLogoutMutation } from "../api/useLogoutMutation"

export const LogoutButton = () => {
    const mutation = useLogoutMutation()

    const handleLogoutClick = () => {
        mutation.mutate()
    }

    return <button onClick={handleLogoutClick}>Logout</button>
}