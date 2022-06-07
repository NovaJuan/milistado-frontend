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
    createdAt: doc.data()?.createdAt.seconds,
    updatedAt: doc.data()?.updatedAt.seconds,
  }))

  return parsedStores as Store[]
}

export const getStoreById = async (id: string) => {
  const storeRef = doc(db, 'stores', id)

  const storeDoc = await getDoc(storeRef)

  return {
    id: storeDoc.id,
    ...storeDoc.data(),
    createdAt: storeDoc.data()?.createdAt.seconds,
    updatedAt: storeDoc.data()?.updatedAt.seconds,
  } as Store
}

export const getStoreByNickname = async (nickname: string) => {
  const storeQuery = query(collection(db, 'stores'), where('nickname', '==', nickname))

  const stores = await getDocs(storeQuery)

  const parsedStores = stores.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt.seconds,
        updatedAt: doc.data()?.updatedAt.seconds,
      } as Store),
  )

  return parsedStores[0]
}
