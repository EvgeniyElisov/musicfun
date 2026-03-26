import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "../../../shared/api/client"
import { authKeys } from "../../../shared/api/keys-factories/authKeysFactory.ts"
import { localStorageKeys } from "../../../shared/config/localstorageKeys"
import { oauthConfig } from "../../../shared/config/apiConfig"

export const useLoginMutation = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            const response = await client.POST("/auth/login", {
                body: {
                    code: code,
                    redirectUri: oauthConfig.redirectUri,
                    rememberMe: true,
                    accessTokenTTL: "1d",
                },
            })

            if (response.error) {
                throw new Error(response.error.message)
            }

            return response.data
        },
        onSuccess: (data: { refreshToken: string; accessToken: string }) => {
            // После логина сохраняем токены и инвалидируем me-запрос,
            // чтобы все auth-зависимые виджеты сразу получили актуального пользователя.
            localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
            localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
            queryClient.invalidateQueries({
                queryKey: authKeys.me(),
            })
        },
    })

    return mutation
}