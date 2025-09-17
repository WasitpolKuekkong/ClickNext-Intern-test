export default defineNuxtRouteMiddleware(() => {
  const { current, hydrate } = useAuth()
  if (process.server) return
  hydrate()
  // กันเฉพาะเส้นทาง /boards/*
  const path = window.location.pathname
  if (path.startsWith('/boards') && !current.value) {
    return navigateTo('/unsigned') // หน้า Login ของคุณ
  }
})
