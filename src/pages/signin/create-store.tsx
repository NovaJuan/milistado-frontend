import { useAuthState } from '../../contexts/AuthContext'
import { db } from '../../utils/firebase'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'

const CreateFirstStoreView = () => {
  const [isLoading, setIsLoading] = useState(true)

  const [storeName, setStoreName] = useState('')
  const [storeNickname, setStoreNickname] = useState('')

  const {
    state: { user, isLoadingUser },
  } = useAuthState()

  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)
    if (isLoadingUser) {
      setIsLoading(true)
    } else if (!!user) {
      const storeQuery = query(collection(db, 'stores'), where('userId', '==', user.id))

      getDocs(storeQuery).then((stores) => {
        if (!!stores.size) {
          router.push('/')
        } else {
          setIsLoading(false)
        }
      })
    } else if (!user) {
      router.push('/signin')
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [user, isLoadingUser])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!storeName || !storeNickname) return

    setIsLoading(true)

    try {
      const storesRef = collection(db, 'stores')

      await addDoc(storesRef, {
        fullName: storeName,
        nickname: storeNickname,
        userId: user?.id,
      })

      router.push('/')
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-8">Create first store</h1>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <input
          value={storeName}
          onChange={(e) => setStoreName(e.currentTarget.value)}
          type="text"
          name="storeName"
          id="storeName"
          className="w-52 mr-2 rounded px-2 py-0.5 text-black mb-2"
          placeholder="Store name"
        />
        <input
          value={storeNickname}
          onChange={(e) => setStoreNickname(e.currentTarget.value.replace(/[^A-Za-z0-9_.]/, '').toLowerCase())}
          type="text"
          name="storeNickname"
          id="storeNickname"
          className="w-52 mr-2 rounded px-2 py-0.5 text-black mb-2"
          placeholder="Store nickname"
        />
        <button type="submit" className="px-4 py-1.5 rounded bg-slate-400 w-28">
          Save
        </button>
      </form>
    </>
  )
}

export default CreateFirstStoreView
