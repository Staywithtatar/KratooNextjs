import React from 'react'
import Link from 'next/link'
import Logo from '../../../../public/romance.svg'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

function AdminNav({ session }) {
    return (
      <nav className='bg-red-500 shadow-xl'>
          <div className='container mx-auto'>
              <div className='flex justify-between items-center p-4'>
                  <div>
                      <Link href="/admin">
                          <Image src={Logo} width={50} height={50} alt="NextJS Logo" />  
                      </Link>
                  </div>
                  <ul className='flex items-center'>
                      {!session ? (
                          <>
                              <li className='mx-3 text-white hover:underline'><Link href="/login">Login</Link></li>
                              <li className='mx-3 text-white hover:underline'><Link href="/register">Register</Link></li>
                          </>
                      ) : (
                          <li>
                              <a  onClick={() => signOut()}
                                  className='bg-white text-red-500 font-bold py-2 px-4 rounded-md text-lg hover:bg-red-100 transition duration-200'>
                                  Logout
                              </a>
                          </li>
                      )}
                  </ul>
              </div>
          </div>
      </nav>
    )
  }
  

export default AdminNav