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
    const [postComments, setPostComments] = useState({});

    const userEmail = session?.user?.email;

    const fetchComments = async (postId) => {
        try {
            const res = await fetch(`/api/comments?postId=${postId}`);
            const data = await res.json();
            setPostComments(prev => ({
                ...prev,
                [postId]: data.comments
            }));
        } catch (error) {
            console.log("Error fetching comments:", error);
        }
    };
    

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

    useEffect(() => {
        // Fetch comments for each post
        postData.forEach(post => fetchComments(post._id));
    }, [postData]);
    

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
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
    {postData && postData.length > 0 ? (
        postData.map(val => (
            <div key={val._id} 
                className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-blue-100'
            >
                {/* Image Container with Gradient Overlay */}
                {val.img && /^https?:\/\/.+/.test(val.img) ? (
                    <div className='relative h-64'>
                        <Image 
                            src={val.img}
                            alt={val.title}
                            fill
                            className='object-cover hover:scale-105 transition-transform duration-500'
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                ) : null}
                
                {/* Content Container */}
                <div className='p-6 flex flex-col flex-grow'>
                    <h4 className='text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors'>
                        {val.title}
                    </h4>
                    <p className='text-gray-600 leading-relaxed mb-4'>
                        {val.content}
                    </p>
                    
                    {/* Comments Section */}
                    <div className='mt-4 mb-6'>
                        <div className='flex items-center gap-2 mb-3'>
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                            </svg>
                            <span className='text-sm text-blue-600 font-medium'>
                                {postComments[val._id]?.length || 0} Comments
                            </span>
                        </div>

                        {/* Comments Preview */}
                        {postComments[val._id]?.slice(0, 2).map(comment => (
                            <div key={comment._id} className='bg-blue-50 rounded-lg p-3 mb-2'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center'>
                                        <span className='text-sm font-bold text-blue-700'>
                                            {comment.author?.name?.[0] || 'A'}
                                        </span>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm text-gray-600'>{comment.content}</p>
                                        <span className='text-xs text-blue-500'>
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {postComments[val._id]?.length > 2 && (
                            <Link 
                                href={`/post/${val._id}`}
                                className='text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1'
                            >
                                View all comments
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        )}
                    </div>

                    {/* Actions Section */}
                    <div className='mt-auto pt-4 border-t border-gray-100'>
                        <div className='flex gap-3'>
                            <Link 
                                href={`/edit/${val._id}`}
                                className='flex-1 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors duration-200'
                            >
                                Edit Post
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