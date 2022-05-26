import { db } from '../../utils/firebase'
import { Store } from './types'
import { collection, doc, getDoc, getDocs, query, QueryConstraint, where } from 'firebase/firestore'

interface GetStoresParams {
  userId?: string
  nickname?: string
}

export const getStores = async (params?: GetStoresParams) => {
  const queryParams: QueryConstraint[] = []

  if (params?.userId) queryParams.push(where('userId', '==', params.userId))
  if (params?.nickname) queryParams.push(where('nickname', '==', params.nickname))

  const storeQuery = query(collection(db, 'stores'), ...queryParams)

  const stores = await getDocs(storeQuery)

  const parsedStores = stores.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  return parsedStores as Store[]
}

export const getStoreById = async (id: string) => {
  const storeRef = doc(db, 'stores', id)

  const store = await getDoc(storeRef)

  return {
    id: store.id,
    ...store.data(),
  } as { id: string; nickname: string; fullname: string }
}

export const getStoreByNickname = async (nickname: string) => {
  const storeQuery = query(collection(db, 'stores'), where('nickname', '==', nickname))

  const stores = await getDocs(storeQuery)

  const parsedStores = stores.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as { id: string; nickname: string; fullname: string }),
  )

  return parsedStores[0]
}
