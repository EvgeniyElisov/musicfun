import createClient, { type Middleware, type MiddlewareCallbackParams } from "openapi-fetch"
import type { paths } from "./schema"
import { apiConfig } from "../config/apiConfig"
import { localStorageKeys } from "../config/localstorageKeys"

// Mutex for refresh token
let refreshPromise: Promise<void> | null = null

function makeRefreshToken() {
    if (!refreshPromise) {
        refreshPromise = (async (): Promise<void> => {
            const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
            if (!refreshToken) throw new Error("No refresh token")

            const response = await fetch(`${apiConfig.baseUrl}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-KEY": apiConfig.apiKey,
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                }),
            })
            if (!response.ok) {
                localStorage.removeItem(localStorageKeys.refreshToken)
                localStorage.removeItem(localStorageKeys.accessToken)
                throw new Error("Failed to refresh token")
            }
            const data = await response.json()
            localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
            localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
        })()

        refreshPromise.finally(() => {
            refreshPromise = null
        })
    }

    return refreshPromise
}

const authMiddleware: Middleware = {
    onRequest({ request }: MiddlewareCallbackParams) {
        const accessToken = localStorage.getItem(localStorageKeys.accessToken)
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
                "Bearer " + localStorage.getItem(localStorageKeys.accessToken),
            )
            return fetch(retryRequest)
        } catch {
            return response
        }
    },
}

export const client = createClient<paths>({
    baseUrl: apiConfig.baseUrl,
    headers: {
        "api-key": apiConfig.apiKey,
    },
})

client.use(authMiddleware);
