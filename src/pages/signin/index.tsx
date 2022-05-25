import { useAuthState } from '../../contexts/AuthContext'
import { getStores } from '../../services/stores'
import { firebaseAuth } from '../../utils/firebase'
import { EmailAuthProvider } from 'firebase/auth'
import 'firebase/compat/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

const firebaseUIConfig = {
  signInFlow: 'popup',
  signInOptions: [EmailAuthProvider.PROVIDER_ID],
}

const SignInView = () => {
  const {
    state: { user, isLoadingUser },
  } = useAuthState()

  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      if (isLoadingUser) {
        setIsLoading(true)
      } else if (user) {
        const stores = await getStores({ userId: user.id })

        if (!stores.length) {
          router.push('/signin/create-store')
        } else {
          router.push('/')
        }
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [user, isLoadingUser])

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <div>
      <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebaseAuth} />
    </div>
  )
}

export default SignInView
