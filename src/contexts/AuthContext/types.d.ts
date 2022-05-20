interface User {
  id: string
  name: string
  email: string
}
interface AuthState {
  isLoadingUser: boolean
  user: User | null
}
