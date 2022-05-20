import { db } from '../utils/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

interface GetItemsParams {
  storeId: string
}

export const getItems = async ({ storeId }: GetItemsParams) => {
  const itemsQuery = query(collection(db, 'items'), where('storeId', '==', storeId))

  const items = await getDocs(itemsQuery)

  const parsedItems = items.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as { id: string; name: string; storeId: string }),
  )

  return parsedItems
}
