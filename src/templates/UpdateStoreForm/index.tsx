import Layout from '../../components/Layout'
import Navbar from '../../components/Navbar'
import TextField from '../../components/TextField'
import { updateStore } from '../../services/stores'
import { Store } from '../../services/stores/types'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  store: Store
}

const schema = yup.object({
  fullname: yup.string().required('Store name is required').trim(),
  nickname: yup.string().required('Store nickname is required').trim(),
})

type FormValues = yup.InferType<typeof schema>

const UpdateStoreForm = ({ store }: Props) => {
  const { isFallback, push: routerPush } = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setValue('fullname', store.fullname)
    setValue('nickname', store.nickname)
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isLoading) return

    clearErrors()
    setGlobalError('')

    try {
      setIsLoading(true)
      const updatedStore = await updateStore(store.id, data)
      routerPush(`/${updatedStore.nickname}`)
    } catch (err) {
      setGlobalError('Something went wrong...')
      setIsLoading(false)
      console.error(err)
    }
  }

  if (isFallback) {
    return (
      <>
        <Navbar />

        <main className="container mx-auto px-4 py-3">
          <h2>loading...</h2>
        </main>
      </>
    )
  }

  const { nickname = '', fullname = '' } = watch()

  return (
    <>
      <Head>
        <title>Update Store - {store?.fullname}</title>
      </Head>

      <Layout>
        <div className="container mx-auto mt-10">
          <form className="mx-auto max-w-116 w-full lg:bg-slate-700 rounded py-6" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center text-2xl font-bold text-white">Update store info</h1>
            <div className="mx-12 mt-3">
              <TextField
                {...register('fullname')}
                label="Store name"
                type="text"
                placeholder="Store name"
                value={fullname}
                wrapperClassName="mb-4"
                error={errors.fullname?.message}
              />
              <TextField
                {...register('nickname', {
                  pattern: /[^a-z0-9_.]/g,
                  setValueAs: (val: string) => val.replace(/[^a-z0-9_.]/g, ''),
                })}
                label="Store nickname"
                type="text"
                placeholder="Store nickname"
                value={nickname}
                error={errors.nickname?.message}
                hint={'Only lowercase letters, numbers, "_" and "."'}
              />
            </div>
            {globalError && (
              <div className="mx-12 mt-2 -mb-3">
                <p className="text-red-500 text-lg text-center">{globalError}</p>
              </div>
            )}
            <div className="flex items-center justify-center mx-12 mt-7">
              <button type="submit" className="w-88 mx-auto bg-blue-600 hover:bg-blue-500 py-2 px-3 rounded">
                {isLoading ? 'Updating...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  )
}

export default UpdateStoreForm
