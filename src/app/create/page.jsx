"use client"

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import Container from '../components/Container'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'

function CreatePage() {
  
    const { data: session } = useSession();
    if (!session) redirect("/login");

    const userEmail = session?.user?.email;

    const [title, setTitle] = useState("");
    const [img, setImg] = useState("");
    const [content, setContent] = useState("");

    const router = useRouter();

    console.log(title, img, content);

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!title || !img || !content) {
          alert("Please complete all inputs.");
          return;
      }
  
      try {
          const res = await fetch("/api/posts", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ title, img, content, userEmail })
          });
  
          if (res.ok) {
              router.push("/welcome");
          } else {
              throw new Error("Failed to create a post");
          }
  
      } catch(error) {
          console.log(error);
      }
  }

    return (
        <Container>
        <Navbar session={session} />
        <div className='flex-grow bg-gradient-to-b from-white to-blue-50'>
            <div className='max-w-3xl mx-auto bg-white shadow-lg my-10 p-8 rounded-2xl'>
                <Link href="/welcome" 
                    className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300'>
                    <span>← Back</span>
                </Link>
                <hr className='my-6 border-blue-100' />
                <h3 className='text-2xl font-bold text-blue-900 mb-6'>Create Post</h3>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <input 
                        type="text" 
                        onChange={(e) => setTitle(e.target.value)} 
                        className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' 
                        placeholder='Post title' 
                    />
                    <input 
                        type="text" 
                        onChange={(e) => setImg(e.target.value)} 
                        className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' 
                        placeholder='Post Image URL' 
                    />
                    <textarea 
                        onChange={(e) => setContent(e.target.value)} 
                        className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' 
                        rows="10" 
                        placeholder='Enter your post content'
                    />
                    <button 
                        type='submit' 
                        className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2'>
                        <span>Create Post</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
        <Footer />
     </Container>
  )
}

export default CreatePage