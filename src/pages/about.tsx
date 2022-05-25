import Navbar from '../components/Navbar'
import Head from 'next/head'

const About = () => {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-3">
        <p>
          <span className="font-bold">milistado</span> is an online middleman for easy communication between businesses
          and clients.
        </p>
      </main>
    </>
  )
}

export default About
