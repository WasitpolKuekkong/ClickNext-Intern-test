export default defineNuxtRouteMiddleware((to) => {

  if (process.server) return

  const { current, hydrate } = useAuth()
  hydrate()


  const publicPaths = new Set<string>(['/unsigned', '/login', '/register'])


  if (to.path.startsWith('/_nuxt') || to.path.startsWith('/favicon')) return
  if (publicPaths.has(to.path)) return


  const requiresAuth =
    to.path === '/' ||
    to.path.startsWith('/board')

  if (requiresAuth && !current.value) {
    return navigateTo('/unsigned')
  }
})
