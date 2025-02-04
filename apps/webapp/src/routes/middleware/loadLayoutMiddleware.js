export async function loadLayoutMiddleware(route) {
    try {
        let layout = route.meta.layout
        let layoutComponent = await import(`@/layouts/${layout}.vue`)
        route.meta.layoutComponent = layoutComponent.default
    } catch (e) {
        let layout = 'DefaultLayout'
        let layoutComponent = await import(`@/layouts/${layout}.vue`)
        route.meta.layoutComponent = layoutComponent.default
    }
}