import { onAuthStateChanged } from 'firebase/auth'
import React, { useContext, useEffect, useReducer } from 'react'

import { firebaseAuth } from '../../utils/firebase'
import { clearUserAction, finishedSignInAction, logOutAction, signInAction, startSignInAction } from './actions'
import AuthReducer, { AuthActionsTypes, initialState } from './reducer'

const AuthContext = React.createContext(initialState)
const DispatchContext = React.createContext<React.Dispatch<AuthActionsTypes>>(() => null)

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState)

  useEffect(() => {
    startSignInAction(dispatch)()
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        signInAction(dispatch)({ name: user.displayName ?? '', email: user.email ?? '' })
      } else {
        clearUserAction(dispatch)()
      }
      finishedSignInAction(dispatch)()
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state))
  }, [state])

  return (
    <AuthContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </AuthContext.Provider>
  )
}

export const useAuthState = () => {
  const state = useContext(AuthContext)
  const dispatch = useContext(DispatchContext)

  return {
    state,
    signIn: signInAction(dispatch),
    logOut: logOutAction,
  }
}
