import { createRoot } from "react-dom/client"
import "../styles/index.css"
import "../styles/reset.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "../routes/routeTree.gen"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Не повторять запрос при ошибке (false = не повторять, число = количество попыток)
      retry: false,
      // Время, в течение которого данные считаются свежими (Infinity = данные никогда не устаревают)
      staleTime: Infinity,
      // Не перезапрашивать данные при монтировании компонента (true = перезапрашивать, если данные устарели)
      refetchOnMount: false,
      // Не перезапрашивать данные при возврате фокуса на окно браузера (true = перезапрашивать при фокусе, если данные устарели)
      refetchOnWindowFocus: false,
      // Не перезапрашивать данные при восстановлении сетевого соединения (true = перезапрашивать при восстановлении сети, если данные устарели)
      refetchOnReconnect: false,
      // Время хранения неактивных данных в кэше перед удалением (10 секунд)
      gcTime: 10 * 1000,
    },
  },
})

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
)
