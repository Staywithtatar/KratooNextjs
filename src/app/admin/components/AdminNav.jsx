import React from 'react'
import Link from 'next/link'
import Logo from '../../../../public/romance.svg'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

function AdminNav({ session }) {
    return (
        <nav className='bg-red-500 shadow-lg'>
        <div className='container mx-auto'>
            <div className='flex justify-between items-center px-6 py-4'>
                <Link href="/admin" className="hover:opacity-90 transition-opacity">
                    <Image src={Logo} width={50} height={50} alt="NextJS Logo" className="drop-shadow-md" />  
                </Link>
                <ul className='flex items-center space-x-6'>
                    {!session ? (
                        <>
                            <li>
                                <Link href="/login" className='text-white hover:text-red-100 transition-colors'>Login</Link>
                            </li>
                            <li>
                                <Link href="/register" className='text-white hover:text-red-100 transition-colors'>Register</Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button 
                                onClick={() => signOut()}
                                className='bg-white text-red-500 font-semibold py-2 px-6 rounded-lg hover:bg-red-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg'
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </nav>
    )
  }
  

export default AdminNav