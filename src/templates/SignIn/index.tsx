import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import TextField from '../../components/TextField'
import { useAuthState } from '../../contexts/AuthContext'
import { getStores } from '../../services/stores'
import { firebaseAuth } from '../../utils/firebase'
import { yupResolver } from '@hookform/resolvers/yup'
import { signInWithEmailAndPassword } from 'firebase/auth'
import 'firebase/compat/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormValues {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().required('Email is required').email('Email is malformed'),
  password: yup.string().required('Password is required'),
})

const SignIn = () => {
  const {
    state: { user, isLoadingUser },
  } = useAuthState()

  const [isLoading, setIsLoading] = useState(true)
  const [globalError, setGlobalError] = useState('')

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  })

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

  const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
    if (isLoading) return

    setIsLoading(true)
    clearErrors()
    setGlobalError('')

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
    } catch (error: any) {
      setIsLoading(false)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setGlobalError('Invalid credentials')
        return
      }
      setGlobalError('Something went wrong. Please try again')
    }
  }

  const { email, password } = watch()

  return (
    <Layout>
      {isLoading && <LoadingSpinner width={100} height={100} />}
      {!isLoading && (
        <div className="container mx-auto mt-10">
          <form className="mx-auto max-w-116 w-full lg:bg-slate-700 rounded py-6" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center text-2xl font-bold text-white">Sign in</h1>
            <div className="mx-12 mt-3">
              <TextField
                {...register('email')}
                label="Email"
                type="text"
                placeholder="Email"
                value={email}
                wrapperClassName="mb-4"
                error={errors.email?.message}
              />
              <TextField
                {...register('password')}
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                error={errors.password?.message}
              />
            </div>
            {globalError && (
              <div className="mx-12 mt-2 -mb-3">
                <p className="text-red-500 text-lg text-center">{globalError}</p>
              </div>
            )}
            <div className="flex items-center justify-center mx-12 mt-7">
              <button type="submit" className="w-88 mx-auto bg-blue-600 hover:bg-blue-500 py-2 px-3 rounded">
                {isLoading ? 'Loading...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

export default SignIn
