import Navbar from '../../components/Navbar'
import { getItem } from '../../services/items'
import { getStores } from '../../services/stores'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

export const getServerSideProps = async (ctx: GetServerSidePropsContext<{ nickname: string; productId: string }>) => {
  const stores = await getStores({ nickname: ctx.params?.nickname })

  const store = stores[0]

  const item = await getItem({ productId: ctx.params?.productId ?? '' })

  if (!store || !item) {
    return {
      notFound: true,
      props: {
        store,
        item,
      },
    }
  }

  return {
    props: {
      store,
      item,
    },
  }
}

const ProductPage = ({ store, item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>
          {item?.name} - {store?.nickname}
        </title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        <h2 className="">@{store?.nickname}</h2>
        <h1 className="text-3xl font-bold">{item?.name}</h1>
      </main>
    </>
  )
}

export default ProductPage
