import { getItems } from '../../services/items'
import { getStores } from '../../services/stores'
import StoreDetails from '../../templates/StoreDetails'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export const getStaticPaths = async () => {
  const stores = await getStores()

  const paths = stores.map((store) => ({
    params: {
      storeNickname: store.nickname,
    },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext<{ storeNickname: string }>) => {
  const stores = await getStores({ nickname: ctx.params?.storeNickname })

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

const StoreDetailsPage = ({ store }: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (!store) return null
  return <StoreDetails store={store} />
}

export default StoreDetailsPage
