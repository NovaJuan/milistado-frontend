import 'firebase/compat/auth'

import { EmailAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/router'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

import { useAuthState } from '../contexts/AuthContext'
import { firebaseAuth } from '../utils/firebase'

const firebaseUIConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [EmailAuthProvider.PROVIDER_ID],
}

const SignInView = () => {
  const {
    state: { user, isLoadingUser },
  } = useAuthState()

  const router = useRouter()

  if (!!user) {
    router.push('/')
    return <div>Loading</div>
  }

  if (isLoadingUser && !window) {
    return <div>Loading</div>
  }

  return (
    <div>
      <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebaseAuth} />
    </div>
  )
}

export default SignInView
