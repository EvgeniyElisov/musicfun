import { useLoginMutation, callbackUrl } from "../api/useLoginMutation.ts";

export const LoginButton = () => {

    const mutation = useLoginMutation()

    const handleOauthMessage = (event: MessageEvent) => {
        console.log('Received message:', event.origin, event.data)
        window.removeEventListener('message', handleOauthMessage)
        if (event.origin !== document.location.origin) {
            console.warn('origin not match', event.origin, document.location.origin)
            return
        }
        const code = event.data.code
        if (!code) {
            console.warn('no code in message')
            return
        }

        mutation.mutate({ code })
    }

    const handleLoginClick = () => {
        console.log('Opening OAuth window with callbackUrl:', callbackUrl)
        window.addEventListener('message', handleOauthMessage)
        window.open(
            `https://musicfun.it-incubator.app/api/1.0/auth/oauth-redirect?callbackUrl=${callbackUrl}`,
            'apihub-oauth2',
            'width=500,height=600'
        )
    }


    return <button onClick={handleLoginClick}>Login with APIHUB</button>
}