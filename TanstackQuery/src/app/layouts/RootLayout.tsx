import { Outlet } from "@tanstack/react-router"
import { Header } from "../../shared/ui/Header/Header"
import styles from "./RootLayout.module.css"
import { LoginButton } from "../../features/auth/ui/LoginButton"

export const RootLayout = () => (
    <>
        <Header renderAccountBar={() => <LoginButton />} />
        <div className={styles.container}>
            <Outlet />
        </div>
    </>
)