import Navbar from '../../components/Navbar'
import { getItems } from '../../services/items'
import { getStores } from '../../services/stores'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const getStaticPaths = async () => {
  const stores = await getStores()

  const paths = stores.map((store) => ({
    params: {
      nickname: store.nickname,
    },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ nickname: string }>) => {
  const stores = await getStores({ nickname: ctx.params?.nickname })

  const store = stores[0]

  if (!store) {
    return {
      notFound: true,
      props: {},
    }
  }

  const items = await getItems({ storeId: store.id })

  return {
    props: { store: { ...store, items } },
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
