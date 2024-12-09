import React from 'react'
import Link from 'next/link'

function SideNav() {
  return (
    <nav className='bg-white shadow-lg rounded-xl overflow-hidden w-64'>
    <div className='p-6'>
        <ul className='space-y-2'>
            <li>
                <Link 
                    href="/admin" 
                    className='flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group'
                >
                    <svg className="w-5 h-5 mr-3 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    Dashboard
                </Link>
            </li>
            <li>
                <Link 
                    href="/admin/users" 
                    className='flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group'
                >
                    <svg className="w-5 h-5 mr-3 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    Users
                </Link>
            </li>
            <li>
                <Link 
                    href="/admin/posts" 
                    className='flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group'
                >
                    <svg className="w-5 h-5 mr-3 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                    Posts
                </Link>
            </li>
        </ul>
    </div>
</nav>
  )
}

export default SideNav