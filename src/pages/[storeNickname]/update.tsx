import { useAuthState } from '../../contexts/AuthContext'
import { getItems } from '../../services/items'
import { getStores } from '../../services/stores'
import { Store } from '../../services/stores/types'
import UpdateStoreForm from '../../templates/UpdateStoreForm'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

const UpdateStore = ({ store }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const {
    state: { user },
  } = useAuthState()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (store && user?.id !== store.userId) {
      setShow(false)
      router.replace(`/${store.nickname}`)
    } else {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return <UpdateStoreForm store={store || ({} as Store)} />
}

export default UpdateStore
