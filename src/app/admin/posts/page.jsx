"use client"

import React, { useState, useEffect } from 'react'
import AdminNav from '../components/AdminNav'
import Footer from '../components/Footer'
import SideNav from '../components/SideNav'
import Container from '../components/Container'
import Link from 'next/link'
import Image from 'next/image'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import DeleteBtn from './DeleteBtn'

function AdminUserManagePage() {

    const { data: session } = useSession();
    if (!session) redirect("/login");
    if (!session?.user?.role === "admin") redirect("/welcome");

    const [allPostsData, setAllPostsData] = useState([]);

    console.log("allPostsData: ", allPostsData)

    const getAllPostsData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`);
            const data = await res.json();
            setAllPostsData(data.totalPosts);
        } catch(error) {
            console.log("Error:", error);
        }
    }

    useEffect(() => {
        getAllPostsData();
    }, [])

    const handleDelete = (deletedId) => {
        setAllPostsData(prevPosts => prevPosts.filter(post => post._id !== deletedId));
    };

  return (
    <Container>
    <AdminNav session={session} />
    <div className='flex-grow bg-gradient-to-b from-white to-red-50'>
        <div className='container mx-auto px-4'>
            <div className='flex mt-10 space-x-6'>
                <SideNav />
                <div className='flex-grow bg-white rounded-2xl shadow-lg p-8'>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className='text-3xl font-bold text-red-600 mb-2'>Manage Posts</h3>
                            <p className='text-gray-600'>A list of posts from MongoDB database</p>
                        </div>
                    </div>

                    <div className='overflow-x-auto mt-6'>
                        <table className='w-full border-collapse bg-white rounded-lg'>
                            <thead>
                                <tr className='bg-red-600 text-white uppercase text-sm'>
                                    <th className='px-6 py-4 font-semibold'>ID</th>
                                    <th className='px-6 py-4 font-semibold'>Title</th>
                                    <th className='px-6 py-4 font-semibold'>Image</th>
                                    <th className='px-6 py-4 font-semibold'>Content</th>
                                    <th className='px-6 py-4 font-semibold'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {allPostsData?.map(val => (
                                    <tr key={val._id} className='hover:bg-red-50 transition-colors duration-200'>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm'>{val._id}</td>
                                        <td className='px-6 py-4 text-sm'>{val.title}</td>
                                        <td className='px-6 py-4'>
                                            <div className="w-20 h-20 rounded-lg overflow-hidden">
                                                <Image 
                                                    src={val.img}
                                                    width={80}
                                                    height={80}
                                                    alt={val.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 text-sm max-w-xs truncate'>{val.content}</td>
                                        <td className='px-6 py-4'>
                                            <div className="flex space-x-2">
                                                <Link 
                                                    href={`/admin/posts/edit/${val._id}`}
                                                    className='inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200'
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteBtn id={val._id} onDelete={handleDelete} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</Container>
  )
}

export default AdminUserManagePage