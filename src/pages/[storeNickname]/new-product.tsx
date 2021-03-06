import Navbar from '../../components/Navbar'
import { useAuthState } from '../../contexts/AuthContext'
import { getStoreByNickname } from '../../services/stores'
import { db } from '../../utils/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'

export const getServerSideProps = async (ctx: GetServerSidePropsContext<{ storeNickname: string }>) => {
  const store = await getStoreByNickname(ctx.params?.storeNickname ?? '')

  if (!store) {
    return {
      notFound: true,
      props: {
        store,
      },
    }
  }

  return {
    props: {
      store,
    },
  }
}

const NewProduct = ({ store }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [productName, setProductName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const {
    state: { user },
  } = useAuthState()

  useEffect(() => {
    if (!user || user?.id !== store.userId) router.push('/')
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!productName || isLoading) return

    try {
      setIsLoading(true)

      const itemsRef = collection(db, 'items')

      await addDoc(itemsRef, {
        storeId: store.id,
        name: productName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      router.push(`/${store.nickname}`)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create new store</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        <h1 className="text-xl font-bold">Create new product for @{store?.nickname}</h1>
        <p className="my-4">
          <Link href={`/${store?.nickname}`} passHref>
            <a className="font-normal text-sm">Go back</a>
          </Link>
        </p>
        <form className="flex flex-col" onSubmit={onSubmit}>
          <input
            value={productName}
            onChange={(e) => setProductName(e.currentTarget.value)}
            type="text"
            name="productName"
            id="productName"
            className="w-32 mr-2 rounded px-2 py-0.5 text-black mb-2"
            placeholder="Product name"
          />
          <button type="submit" className="px-4 py-1.5 rounded bg-slate-400 w-28">
            {isLoading ? 'Creating...' : 'Save'}
          </button>
        </form>
      </main>
    </>
  )
}

export default NewProduct
