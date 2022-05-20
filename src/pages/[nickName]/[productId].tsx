import Navbar from '../../components/Navbar'
import { db } from '../../utils/firebase'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

export const getServerSideProps = async (ctx: GetServerSidePropsContext<{ nickname: string; productId: string }>) => {
  const storeQuery = query(collection(db, 'stores'), where('nickname', '==', ctx.params?.nickname))

  const stores = await getDocs(storeQuery)

  const parsedStores = stores.docs.map(
    (store) =>
      ({
        id: store.id,
        ...store.data(),
      } as { id: string; nickname: string; fullName: string }),
  )

  const store = parsedStores[0]

  const item = await getDoc(doc(db, 'items', ctx.params?.productId ?? ''))

  const product = {
    id: item.id,
    ...item.data(),
  } as { id: string; storeId: string; name: string }

  if (!store || !product) {
    return {
      notFound: true,
      props: {
        store,
        item: product,
      },
    }
  }

  return {
    props: {
      store,
      product,
    },
  }
}

const ProductPage = ({ store, product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>
          {product?.name} - {store?.nickname}
        </title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        <h2 className="">@{store?.nickname}</h2>
        <h1 className="text-3xl font-bold">{product?.name}</h1>
      </main>
    </>
  )
}

export default ProductPage
