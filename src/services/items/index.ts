import { db } from '../../utils/firebase'
import { Item } from './types'
import { collection, getDocs, query, where, limit as queryLimit, orderBy, getDoc, doc } from 'firebase/firestore'

interface GetItemsParams {
  storeId: string
  limit?: number
}
interface GetItemParams {
  productId: string
}

export const getItems = async ({ storeId, limit }: GetItemsParams) => {
  const queryConstraints = [where('storeId', '==', storeId), orderBy('createdAt', 'desc')]

  if (limit) queryConstraints.push(queryLimit(limit))

  const itemsQuery = query(collection(db, 'items'), ...queryConstraints)

  const items = await getDocs(itemsQuery)

  const parsedItems = items.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.seconds,
        updatedAt: doc.data().updatedAt.seconds,
      } as Item),
  )

  return parsedItems
}

export const getItem = async ({ productId }: GetItemParams) => {
  const itemDoc = await getDoc(doc(db, 'items', productId))

  if (!itemDoc?.data()) return null

  const parsedItems = {
    id: itemDoc.id,
    ...itemDoc.data(),
    createdAt: itemDoc.data()?.createdAt.seconds,
    updatedAt: itemDoc.data()?.updatedAt.seconds,
  } as Item

  return parsedItems
}
