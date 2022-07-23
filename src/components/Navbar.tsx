import { useAuthState } from '../contexts/AuthContext'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const {
    state: { user },
    logOut,
  } = useAuthState()

  return (
    <div className="h-14 bg-gray-700">
      <div className="w-full h-full flex items-center container px-4 mx-auto">
        <Link href="/" passHref>
          <a>
            <h1 className="font-bold text-2xl -mt-0.5">milistado</h1>
          </a>
        </Link>

        <nav className="ml-10">
          <ul className="flex space-x-3">
            <li>
              <Link href="/" passHref>
                <a>
                  <span className="text-gray-300 hover:text-white">Home</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about" passHref>
                <a>
                  <span className="text-gray-300 hover:text-white">About</span>
                </a>
              </Link>
            </li>
            {!!user && (
              <li>
                <Link href="/new-store" passHref>
                  <a>
                    <span className="text-gray-300 hover:text-white">New Store</span>
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <nav className="ml-auto">
          <ul className="flex space-x-3">
            {!user ? (
              <>
                <li>
                  <Link href="/signin" passHref>
                    <a>
                      <span className="text-gray-300 hover:text-white">Sign in</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/register" passHref>
                    <a>
                      <span className="text-gray-300 hover:text-white">Register</span>
                    </a>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <a onClick={logOut}>
                  <span className="text-gray-300 hover:text-white cursor-pointer">Log out</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
