import { QueryClient } from '@tanstack/vue-query'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
})

export default {
    install: (app) => {
        app.use('queryClient', queryClient)
        app.config.globalProperties.queryClient = queryClient;
    }
}