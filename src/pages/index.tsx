import Layout from '../components/Layout'
import { getItems } from '../services/items'
import { getStores } from '../services/stores'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

export const getServerSideProps = async () => {
  const stores = await getStores()

  const storesWithItems = await Promise.all(
    stores.map(async (store) => {
      const items = await getItems({ storeId: store.id, limit: 3 })

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

      <Layout>
        <main className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-4">
            {stores.map((store) => (
              <div className="min-h-48 rounded bg-slate-700 overflow-hidden flex flex-col" key={store.id}>
                <Link href={`/${store.nickname}`} passHref>
                  <a className="flex items-center justify-between py-3 px-4 border-b border-slate-500">
                    <h2 className="text-xl font-bold">{store.fullname}</h2>
                    <FiChevronRight size={24} />
                  </a>
                </Link>
                <div className="px-4 py-2 bg-slate-600  flex-1">
                  <h3>Latest products:</h3>
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
              </div>
            ))}
          </div>
        </main>
      </Layout>
    </>
  )
}

export default Home
