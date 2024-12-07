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
            const res = await fetch('/api/totalposts');
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
        <div className='flex-grow'>
            <div className='container mx-auto'>
                <div className='flex mt-10'>
                    <SideNav />
                    <div className='p-8 bg-white rounded-lg shadow-lg flex-grow'>
                        <h3 className='text-3xl font-bold mb-4 text-red-500'>Manage Posts</h3>
                        <p className='text-gray-600'>A list of posts retrieved from a MongoDB database</p>

                        <div className='overflow-x-auto mt-6'>
                            <table className='table-auto w-full text-left rounded-lg'>
                                <thead>
                                    <tr className='bg-red-500 text-white'>
                                        <th className='p-4'>Post ID</th>
                                        <th className='p-4'>Post Title</th>
                                        <th className='p-4'>Post Image</th>
                                        <th className='p-4'>Post Content</th>
                                        <th className='p-4'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPostsData?.map(val => (
                                        <tr key={val._id} className='border-b border-gray-200 hover:bg-gray-100'>
                                            <td className='p-4'>{val._id}</td>
                                            <td className='p-4'>{val.title}</td>
                                            <td className='p-4'>
                                                <img 
                                                    className='my-2 rounded-md'
                                                    src={val.img}
                                                    width={80}
                                                    height={80}
                                                    alt={val.title}
                                                />
                                            </td>
                                            <td className='p-4'>{val.content}</td>
                                            <td className='p-4'>
                                                <Link className='bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-lg my-2 transition duration-200' href={`/admin/posts/edit/${val._id}`}>Edit</Link>
                                                <DeleteBtn id={val._id} onDelete={handleDelete} />
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