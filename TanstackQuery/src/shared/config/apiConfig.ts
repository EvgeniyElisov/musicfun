const baseUrl = import.meta.env.VITE_BASE_URL
const apiKey = import.meta.env.VITE_API_KEY

if (!baseUrl || !apiKey) {
    throw new Error("Missing required env vars: VITE_BASE_URL and VITE_API_KEY")
}

export const apiConfig = {
    baseUrl,
    apiKey,
} as const

export const oauthConfig = {
    get redirectUri() {
        return `${window.location.origin}/oauth/callback`
    },
} as const