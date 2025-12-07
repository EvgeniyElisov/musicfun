import { baseApi } from "@/app/api/baseApi"
import type { LoginArgs, LoginResponse, MeResponse } from "./authApi.types"

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: payload => ({
        url: `auth/login`,
        method: 'post',
        body: { ...payload, accessTokenTTL: '3m' },
      }),
    }),
  }),
})
 
export const { useGetMeQuery, useLoginMutation } = authApi