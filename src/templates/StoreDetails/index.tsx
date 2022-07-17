import Navbar from '../../components/Navbar'
import { useAuthState } from '../../contexts/AuthContext'
import { Store } from '../../services/stores/types'
import useDeleteStoreModal from './hooks/useDeleteStoreModal'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  store: Store
}

const StoreDetails = ({ store }: Props) => {
  const { isFallback } = useRouter()

  const {
    state: { user },
  } = useAuthState()

  const { DeleteStoreModal, activate: activateDeleteStoreModal } = useDeleteStoreModal({ store })

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
        <title>{store?.fullname}</title>
      </Head>

      <Navbar />

      <DeleteStoreModal />

      <main className="container mx-auto px-4 py-3">
        <h1 className="text-3xl font-bold">{store?.fullname}</h1>
        <h2 className="">@{store?.nickname}</h2>

        <ul className="pl-4 mt-4">
          {store?.items?.map((item) => (
            <Link href={`/${store?.nickname}/${item.id}`} key={item.id} passHref>
              <a className="block">
                <li className="list-disc text-lg">{item.name}</li>
              </a>
            </Link>
          ))}
        </ul>

        {user?.id === store?.userId && (
          <div className="mt-6">
            <h4 className="font-bold">Owner options</h4>
            <ul className="flex space-x-4 mt-1">
              <li>
                <Link href={`/${store?.nickname}/new-product`} passHref>
                  <a className="font-normal text-sm block py-1.5 px-3 hover:bg-slate-700 rounded bg-slate-600 border border-slate-900">
                    New Product
                  </a>
                </Link>
              </li>
              <li>
                <Link href={`/${store?.nickname}/update`} passHref>
                  <a className="font-normal text-sm block py-1.5 px-3 hover:bg-slate-700 rounded bg-slate-600 border border-slate-900">
                    Update store
                  </a>
                </Link>
              </li>
              <li>
                <a
                  className="font-normal text-sm text-red-300 cursor-pointer block py-1.5 px-3 hover:bg-red-800 rounded bg-red-900 border border-red-800"
                  onClick={activateDeleteStoreModal}
                >
                  Delete store
                </a>
              </li>
            </ul>
          </div>
        )}
      </main>
    </>
  )
}

export default StoreDetails
