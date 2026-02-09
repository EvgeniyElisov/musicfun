import { CurrentUser } from "./CurrentUser.tsx"
import { useMeQuery } from "../api/useMeQuery"
import { LoginButton } from "./LoginButton.tsx"

export const AccountBar = () => {
    const query = useMeQuery()

    if (query.isPending) return <></>

    return (
        <div>
            {!query.data && <LoginButton />}
            {query.data && <CurrentUser />}
        </div>
    )
}