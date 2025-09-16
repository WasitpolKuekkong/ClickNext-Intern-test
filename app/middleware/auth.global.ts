export default defineNuxtRouteMiddleware((to) => {

const protectedPaths = ['/']
const needsAuth = protectedPaths.some(p => to.path === p || to.path.startsWith(p) )
if (!needsAuth) return
if (to.path === '/login' || to.path === '/register') return
if (process.client && !localStorage.getItem('session')) return navigateTo('/login')
})