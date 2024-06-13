import { QueryClient } from '@tanstack/vue-query'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
})



export default (app) => {
    app.use('queryClient', queryClient)
}