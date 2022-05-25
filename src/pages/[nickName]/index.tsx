import Navbar from '../../components/Navbar'
import { db } from '../../utils/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const getStaticPaths = async () => {
  const stores = await getDocs(collection(db, 'stores'))

  const paths = stores.docs.map((doc) => ({
    params: {
      nickname: doc.data().nickname,
    },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ nickname: string }>) => {
  const storeQuery = query(collection(db, 'stores'), where('nickname', '==', ctx.params?.nickname))

  const stores = await getDocs(storeQuery)

  const parsedStores = stores.docs.map(
    (store) =>
      ({
        id: store.id,
        ...store.data(),
      } as { id: string; nickname: string; fullname: string }),
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
        <title>{store?.nickname}</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        <h1 className="text-3xl font-bold">{store?.fullname}</h1>
        <h2 className="">@{store?.nickname}</h2>

        <ul className="pl-4 mt-4">
          {store?.items.map((item) => (
            <Link href={`/${store?.nickname}/${item.id}`} key={item.id} passHref>
              <a className="block">
                <li className="list-disc text-lg">{item.name}</li>
              </a>
            </Link>
          ))}
        </ul>

        <p className="mt-4">
          {' '}
          <Link href={`/${store?.nickname}/new-product`} passHref>
            <a className="font-normal text-sm">New Product</a>
          </Link>
        </p>
      </main>
    </>
  )
}

export default Profile
