import { signOut } from 'firebase/auth'
import React from 'react'

import { firebaseAuth } from '../../utils/firebase'
import { AuthActionsTypes } from './reducer'

export const startSignInAction = (dispatch: React.Dispatch<AuthActionsTypes>) => () => {
  dispatch({ type: 'START_SIGN_IN' })
}
export const finishedSignInAction = (dispatch: React.Dispatch<AuthActionsTypes>) => () => {
  dispatch({ type: 'FINISHED_SIGN_IN' })
}

export const signInAction = (dispatch: React.Dispatch<AuthActionsTypes>) => (user: User) => {
  dispatch({ type: 'SIGN_IN', user })
}

export const clearUserAction = (dispatch: React.Dispatch<AuthActionsTypes>) => () => {
  dispatch({ type: 'CLEAR_USER' })
}

export const logOutAction = async () => {
  localStorage.removeItem('auth')
  await signOut(firebaseAuth)
  location.pathname = '/'
}
