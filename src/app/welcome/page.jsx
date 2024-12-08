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
   <div className='flex-grow bg-gradient-to-b from-white to-blue-50'>
       <div className='container mx-auto bg-white shadow-lg my-10 p-8 rounded-2xl'>
           {/* Profile Section */}
           <div className='flex justify-between items-center mb-8'>
               <div className='space-y-2'>
                   <h3 className='text-3xl font-bold text-blue-900'>Profile</h3>
                   <p className='text-blue-800'>Welcome, {session?.user?.name}</p>
                   <p className='text-blue-600'>{session?.user?.email}</p>
               </div>
               <div>
                   <Link href="/create" 
                       className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2'>
                       <span>Create Post</span>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                       </svg>
                   </Link>
               </div>
           </div>

           {/* Posts Section */}
           <div>
               {postData && postData.length > 0 ? (
                   postData.map(val => (
                       <div key={val._id} className='bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 my-8 p-8 rounded-xl border border-blue-100'>
                           <h4 className='text-2xl font-semibold text-blue-900 mb-4'>{val.title}</h4>
                           {val.img && /^https?:\/\/.+/.test(val.img) ? (
                               <div className='relative w-full h-64 mb-6 rounded-lg overflow-hidden'>
                                   <Image 
                                       className='object-cover w-full h-full hover:scale-105 transition-transform duration-300' 
                                       src={val.img}
                                       alt={val.title}
                                       width={300}
                                        height={200}
                                        layout="responsive"
                                        objectFit="cover"
                                   />
                               </div>
                           ) : (
                               <p className='text-red-500'>Invalid image URL</p>
                           )}
                           <p className='text-gray-600 leading-relaxed mb-6'>{val.content}</p>
                           <div className='flex gap-3'>
                               <Link 
                                   className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300' 
                                   href={`/edit/${val._id}`}>
                                   Edit
                               </Link>
                               <DeleteBtn id={val._id} onDelete={handlePostDelete} />
                           </div>
                       </div>
                   ))
               ) : (
                   <div className='bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg'>
                       <p>You do not have any posts yet.</p>
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