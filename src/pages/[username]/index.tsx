import { collection, getDocs, query, where } from 'firebase/firestore'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Navbar from '../../components/Navbar'
import { db } from '../../utils/firebase'

export const getStaticPaths = async () => {
  const stores = await getDocs(collection(db, 'stores'))

  const paths = stores.docs.map((doc) => ({
    params: {
      username: doc.data().username,
    },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ username: string }>) => {
  const storeQuery = query(collection(db, 'stores'), where('username', '==', ctx.params?.username))

  const stores = await getDocs(storeQuery)

  const parsedStores = stores.docs.map(
    (store) =>
      ({
        id: store.id,
        ...store.data(),
      } as { id: string; username: string; name: string }),
  )

  const store = parsedStores[0]

  if (!store) {
    return {
      notFound: true,
      props: {},
    }
  }

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
    props: { store: { ...store, items: parsedItems } },
    revalidate: 30,
  }
}

const Profile = ({ store }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return (
      <>
        <Navbar />

        <main className="container mx-auto px-4 py-3">
          <h2>loading...</h2>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{store?.username}</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        <h1 className="text-3xl font-bold">{store?.name}</h1>
        <h2 className="">@{store?.username}</h2>

        <ul className="pl-4 mt-4">
          {store?.items.map((item) => (
            <Link href={`/${store?.username}/${item.id}`} key={item.id} passHref>
              <a className="block">
                <li className="list-disc text-lg">{item.name}</li>
              </a>
            </Link>
          ))}
        </ul>
      </main>
    </>
  )
}

export default Profile
