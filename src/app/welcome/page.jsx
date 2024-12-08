"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import Container from '../components/Container'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import DeleteBtn from './DeleteBtn'

function WelcomePage() {

    const { data: session } = useSession();
    if (!session) redirect('/login');
    console.log(session);

    if (session?.user?.role === "admin") redirect("/admin");

    const [postData, setPostData] = useState([]);

    const userEmail = session?.user?.email;

    const handlePostDelete = (deletedId) => {
        setPostData(posts => posts.filter(post => post._id !== deletedId));
    };
    
    const getPosts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts?email=${userEmail}`);
            const data = await res.json();
            console.log("Posts data:", data); // เพิ่ม log
            setPostData(data.posts);
        } catch(error) {
            console.log("Error:", error);
        }
    }
    
    useEffect(() => {
        if(userEmail) {
            getPosts();
        }
    }, [userEmail, getPosts]);

  return (
    <Container>
            <Navbar session={session} />
            <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
                <div className='container mx-auto px-4 py-8'>
                    {/* Profile Card */}
                    <div className='bg-white rounded-2xl shadow-lg p-8 mb-8'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                            <div className='text-center md:text-left'>
                                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 md:mb-0'>
                                    <span className='text-2xl font-bold text-blue-600'>
                                        {session?.user?.name?.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className='text-2xl font-bold text-gray-800'>{session?.user?.name}</h3>
                                    <p className='text-gray-600'>{session?.user?.email}</p>
                                </div>
                            </div>
                            <Link href="/create" 
                                className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl'>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                <span>Create New Post</span>
                            </Link>
                        </div>
                    </div>

                  {/* Posts Grid Section */}
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
   {postData && postData.length > 0 ? (
       postData.map(val => (
           <div key={val._id} 
               className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden h-[500px] flex flex-col border border-blue-50'
           >
               {/* Image Container */}
               {val.img && /^https?:\/\/.+/.test(val.img) ? (
                   <div className='h-48 relative'>
                       <Image 
                           src={val.img}
                           alt={val.title}
                           fill
                           className='object-cover hover:scale-105 transition-transform duration-300'
                       />
                   </div>
               ) : null}
               
               {/* Content Container */}
               <div className='p-5 flex flex-col flex-grow'>
                   <h4 className='text-xl font-semibold text-blue-900 mb-2 line-clamp-2 hover:text-blue-700 transition-colors'>
                       {val.title}
                   </h4>
                   <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4'>
                       {val.content}
                   </p>
                   
                   {/* Actions Section */}
                   <div className='mt-auto pt-4 border-t border-blue-50'>
                       <div className='flex items-center justify-between text-sm mb-3'>
                           <span className='text-blue-500 flex items-center'>
                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                               </svg>
                               {new Date().toLocaleDateString()}
                           </span>
                       </div>
                       <div className='flex gap-2'>
                           <Link 
                               href={`/edit/${val._id}`}
                               className='flex-1 text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors duration-200 text-sm font-medium'
                           >
                               <span>Edit</span>
                           </Link>
                           <DeleteBtn id={val._id} onDelete={handlePostDelete} />
                       </div>
                   </div>
               </div>
           </div>
       ))
   ) : (
       <div className='col-span-full bg-blue-50 border border-blue-100 rounded-lg p-8 text-center'>
           <svg className="w-12 h-12 mx-auto mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
           </svg>
           <p className='text-blue-600'>No posts yet.</p>
           <Link href="/create" 
               className='mt-3 inline-flex items-center text-blue-700 hover:text-blue-800 font-medium text-sm'
           >
               Create your first post
               <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
               </svg>
           </Link>
       </div>
   )}
</div>
                </div>
            </div>
            <Footer />
        </Container>
  )
}

export default WelcomePage