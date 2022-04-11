interface User {
  name: string
  email: string
}
interface AuthState {
  isLoadingUser: boolean
  user: User | null
}
