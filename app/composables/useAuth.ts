export type User = { email: string; password: string; name?: string }


const LS_USERS = 'users'
const LS_SESSION = 'session'


export function useAuth(){
const current = useState<User | null>('me', () => null)


const load = (): User[] => {
if (!process.client) return []
try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]') } catch { return [] }
}
const save = (u: User[]) => { if (process.client) localStorage.setItem(LS_USERS, JSON.stringify(u)) }


const hydrate = () => {
if (!process.client) return
const email = localStorage.getItem(LS_SESSION)
const users = load()
current.value = email ? users.find(u => u.email === email) || null : null
}


const register = async (email: string, password: string, name?: string) => {
const users = load()
if (users.some(u => u.email === email)) throw new Error('Email already exists')
users.push({ email, password, name }); save(users)
localStorage.setItem(LS_SESSION, email)
current.value = { email, password, name }
}


const login = async (email: string, password: string) => {
const users = load()
const user = users.find(u => u.email === email)
if (!user) throw new Error('User not found')
if (user.password !== password) throw new Error('Wrong password')
localStorage.setItem(LS_SESSION, email)
current.value = user
}


const logout = () => { if (!process.client) return; localStorage.removeItem(LS_SESSION); current.value = null }


return { current, hydrate, register, login, logout }
}