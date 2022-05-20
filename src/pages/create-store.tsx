import Navbar from '../components/Navbar'
import { db } from '../utils/firebase'
import { addDoc, collection } from 'firebase/firestore'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

const CreateStore = () => {
  const [storeName, setStoreName] = useState('')
  const [storeNickname, setStoreNickname] = useState('')

  const router = useRouter()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const storesRef = collection(db, 'stores')

    await addDoc(storesRef, {
      name: storeName,
      nickname: storeNickname,
    })

    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Create new store</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        <h1 className="text-xl font-bold mb-8">Create new store</h1>
        <form className="flex flex-col" onSubmit={onSubmit}>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.currentTarget.value)}
            type="text"
            name="storeName"
            id="storeName"
            className="w-32 mr-2 rounded px-2 py-0.5 text-black mb-2"
            placeholder="Store name"
          />
          <input
            value={storeNickname}
            onChange={(e) => setStoreNickname(e.currentTarget.value)}
            type="text"
            name="storeNickname"
            id="storeNickname"
            className="w-32 mr-2 rounded px-2 py-0.5 text-black mb-2"
            placeholder="Store nickname"
          />
          <button type="submit" className="px-4 py-1.5 rounded bg-slate-400 w-28">
            Save
          </button>
        </form>
      </main>
    </>
  )
}

export default CreateStore
