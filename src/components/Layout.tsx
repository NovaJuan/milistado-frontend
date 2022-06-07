import Navbar from '../components/Navbar'
import Head from 'next/head'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>Milistado</title>
      </Head>

      <Navbar />

      {children}
    </>
  )
}

export default Layout
