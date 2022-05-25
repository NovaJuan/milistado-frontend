import { db } from '../../utils/firebase'
import { collection, doc, getDoc, getDocs, query, QueryConstraint, where } from 'firebase/firestore'

interface GetStoresParams {
  userId?: string
}

export const getStores = async (params?: GetStoresParams) => {
  const queryParams: QueryConstraint[] = []

  if (params?.userId) queryParams.push(where('userId', '==', params.userId))

  const storeQuery = query(collection(db, 'stores'), ...queryParams)

  const stores = await getDocs(storeQuery)

  const parsedStores = stores.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as { id: string; nickname: string; fullname: string }),
  )

  return parsedStores
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
