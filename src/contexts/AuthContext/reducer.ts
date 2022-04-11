type SIGN_IN = { type: 'SIGN_IN'; user: User }
type START_SIGN_IN = { type: 'START_SIGN_IN' }
type FINISHED_SIGN_IN = { type: 'FINISHED_SIGN_IN' }
type CLEAR_USER = { type: 'CLEAR_USER' }

let _initialState: AuthState = {
  isLoadingUser: false,
  user: null,
}

if (typeof window !== 'undefined') {
  const savedState = JSON.parse(localStorage.getItem('auth') ?? 'null')
  _initialState = savedState ?? _initialState
}

export const initialState = _initialState

export type AuthActionsTypes = SIGN_IN | CLEAR_USER | START_SIGN_IN | FINISHED_SIGN_IN

const AuthReducer = (state = initialState, action: AuthActionsTypes): AuthState => {
  switch (action.type) {
    case 'START_SIGN_IN':
      return { ...state, isLoadingUser: true }
    case 'FINISHED_SIGN_IN':
      return { ...state, isLoadingUser: false }
    case 'SIGN_IN':
      return { ...state, user: action.user, isLoadingUser: false }
    case 'CLEAR_USER':
      return { ...state, user: null }

    default:
      return state
  }
}

export default AuthReducer
