import { collection, getDocs, query, where } from 'firebase/firestore'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import Navbar from '../components/Navbar'
import { db } from '../utils/firebase'

export const getServerSideProps = async () => {
  const stores = await getDocs(collection(db, 'stores'))

  const parsedStores = stores.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as { id: string; username: string; name: string }),
  )

  const parsedStoresWithItems = await Promise.all(
    parsedStores.map(async (store) => {
      const itemsQuery = query(collection(db, 'items'), where('storeId', '==', store.id))

      const items = await getDocs(itemsQuery)

      const parsedItems = items.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as { id: string; name: string }),
      )

      return {
        ...store,
        items: parsedItems,
      }
    }),
  )

  return {
    props: {
      stores: parsedStoresWithItems,
    },
  }
}

const Home = ({ stores }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Milistado</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        {stores.map((store) => (
          <div className="border-b last:border-none border-gray-400 py-5" key={store.id}>
            <Link href={`/${store.username}`} passHref>
              <a className="block">
                <h2 className="text-xl font-bold">{store.name}</h2>
              </a>
            </Link>
            <ul className="pl-4">
              {store.items.map((item) => (
                <Link href={`/${store.username}/${item.id}`} key={item.id} passHref>
                  <a className="block">
                    <li className="list-disc">{item.name}</li>
                  </a>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </>
  )
}

export default Home
