"use client"

import React from 'react'
import Link from 'next/link'
import Logo from '../../../public/gaming.svg'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

function Navbar({ session }) {
    return (
      <nav className='bg-white shadow-lg border-b border-blue-100'>
          <div className='container mx-auto'>
              <div className='flex justify-between items-center p-4'>
                  <div className='hover:opacity-80 transition-all duration-300'>
                      <Link href="/">
                          <Image src={Logo} width={50} height={50} alt='NextJS Logo' />
                      </Link>
                  </div>
                  <ul className='flex items-center space-x-6'>
                      {!session ? (
                          <>
                              <li><Link href="/login" className='text-blue-600 hover:text-blue-800 font-medium'>Login</Link></li>
                              <li><Link href="/register" className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300'>Register</Link></li>
                          </>
                      ) : (
                          <li className='flex space-x-4'>
                              <Link href="/welcome" className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300'>Profile</Link>
                              <button onClick={() => signOut()} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300'>Logout</button>
                          </li>
                      )}
                  </ul>
              </div>
          </div>
      </nav>
    )
  }

export default Navbar