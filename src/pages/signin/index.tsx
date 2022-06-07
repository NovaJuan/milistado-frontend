import Layout from '../../components/Layout'
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
    <Layout>
      <div className="w-full max-w-92 mx-auto py-20">
        <h1 className="font-bold text-3xl text-center mb-6">milistado</h1>
        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebaseAuth} />
      </div>
    </Layout>
  )
}

export default SignInView
