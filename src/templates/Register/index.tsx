import Layout from '../../components/Layout'
import TextField from '../../components/TextField'
import { useAuthState } from '../../contexts/AuthContext'
import { getStores } from '../../services/stores'
import { firebaseAuth } from '../../utils/firebase'
import { yupResolver } from '@hookform/resolvers/yup'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import 'firebase/compat/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormValues {
  name: string
  email: string
  password: string
  password2: string
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Email is malformed'),
  password: yup.string().required('Password is required'),
  password2: yup.string().required('Password confirmation is required'),
})

const Register = () => {
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
      await createUserWithEmailAndPassword(firebaseAuth, email, password)
    } catch (error: any) {
      setIsLoading(false)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setGlobalError('Invalid credentials')
        return
      }
      setGlobalError('Something went wrong. Please try again')
    }
  }

  const { email, password, password2, name } = watch()

  return (
    <Layout>
      <div className="container mx-auto mt-10">
        <form className="mx-auto max-w-116 w-full lg:bg-slate-700 rounded py-6" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-center text-2xl font-bold text-white">Register</h1>
          <div className="mx-12 mt-3">
            <TextField
              {...register('name')}
              label="Name"
              type="text"
              placeholder="Name"
              value={name}
              wrapperClassName="mb-4"
              error={errors.name?.message}
            />
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
              wrapperClassName="mb-4"
              value={password}
              error={errors.password?.message}
            />
            <TextField
              {...register('password2')}
              label="Confirm"
              type="password"
              placeholder="Confirm Password"
              value={password2}
              error={errors.password2?.message}
            />
          </div>
          {globalError && (
            <div className="mx-12 mt-2 -mb-3">
              <p className="text-red-500 font-semibold text-lg text-center">{globalError}</p>
            </div>
          )}
          <div className="flex items-center justify-center mx-12 mt-7">
            <button type="submit" className="w-88 mx-auto bg-blue-600 hover:bg-blue-500 py-2 px-3 rounded">
              {isLoading ? 'Loading...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default Register
