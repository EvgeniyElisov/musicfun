import createClient, { type Middleware, type MiddlewareCallbackParams } from "openapi-fetch"
import type { paths } from "./schema"

export const baseUrl = "https://musicfun.it-incubator.app/api/1.0/"
export const apiKey = "ee3e0687-1ce1-45ba-a6ad-da7a7b5adef0"

// Mutex for refresh token
let refreshPromise: Promise<void> | null = null

function makeRefreshToken() {
    if (!refreshPromise) {
        refreshPromise = (async (): Promise<void> => {
            const refreshToken = localStorage.getItem("musicfun-refresh-token")
            if (!refreshToken) throw new Error("No refresh token")

            const response = await fetch(baseUrl + "auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-KEY": apiKey,
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                }),
            })
            if (!response.ok) {
                localStorage.removeItem("musicfun-refresh-token")
                localStorage.removeItem("musicfun-access-token")
                throw new Error("Failed to refresh token")
            }
            const data = await response.json()
            localStorage.setItem("musicfun-refresh-token", data.refreshToken)
            localStorage.setItem("musicfun-access-token", data.accessToken)
        })()

        refreshPromise.finally(() => {
            refreshPromise = null
        })
    }

    return refreshPromise
}

const authMiddleware: Middleware = {
    onRequest({ request }: MiddlewareCallbackParams) {
        // set "foo" header
        const accessToken = localStorage.getItem("musicfun-access-token")
        if (accessToken) {
            request.headers.set("Authorization", "Bearer " + accessToken)
        }

        // @ts-expect-error hot fix
        request._retryRequest = request.clone()

        return request
    },

    async onResponse({ request, response }) {
        if (response.ok) return response
        if (!response.ok && response.status !== 401) {
            throw new Error(`${response.url}: ${response.status} ${response.statusText}`)
        }

        try {
            await makeRefreshToken()
            // @ts-expect-error ignore it
            const originalRequest: Request = request._retryRequest
            const retryRequest = new Request(originalRequest, {
                headers: new Headers(originalRequest.headers),
            })
            retryRequest.headers.set(
                "Authorization",
                "Bearer " + localStorage.getItem("musicfun-access-token"),
            )
            return fetch(retryRequest)
        } catch {
            return response
        }
    },
}

export const client = createClient<paths>({
    baseUrl: "https://musicfun.it-incubator.app/api/1.0",
    headers: {
        "api-key": "ee3e0687-1ce1-45ba-a6ad-da7a7b5adef0",
    },
})

client.use(authMiddleware);
