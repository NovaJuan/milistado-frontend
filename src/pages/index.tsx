import Navbar from '../components/Navbar'
import { getItems } from '../services/items'
import { getStores } from '../services/stores'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'

export const getServerSideProps = async () => {
  const stores = await getStores()

  const storesWithItems = await Promise.all(
    stores.map(async (store) => {
      const items = await getItems({ storeId: store.id })

      return {
        ...store,
        items,
      }
    }),
  )

  return {
    props: {
      stores: storesWithItems,
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
            <Link href={`/${store.nickname}`} passHref>
              <a className="block">
                <h2 className="text-xl font-bold">{store.fullName}</h2>
              </a>
            </Link>
            <ul className="pl-4">
              {store.items.map((item) => (
                <Link href={`/${store.nickname}/${item.id}`} key={item.id} passHref>
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
