import React from 'react'
import Link from 'next/link'

function SideNav() {
  return (
    <nav className='bg-white shadow-lg p-8 rounded-lg'>
        <ul>
            <li><Link className='block my-3 p-3 rounded-lg text-gray-800 hover:text-red-500 hover:bg-red-100 transition duration-200' href="/admin">Dashboard</Link></li>
            <li><Link className='block my-3 p-3 rounded-lg text-gray-800 hover:text-red-500 hover:bg-red-100 transition duration-200' href="/admin/users">Users</Link></li>
            <li><Link className='block my-3 p-3 rounded-lg text-gray-800 hover:text-red-500 hover:bg-red-100 transition duration-200' href="/admin/posts">Posts</Link></li>
        </ul>
    </nav>
  )
}

export default SideNav