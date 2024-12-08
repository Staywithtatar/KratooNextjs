// app/admin/posts/edit/[id]/EditComponent.jsx
"use client"
import { useState, useEffect } from 'react'
import AdminNav from '@/app/admin/components/AdminNav'
import Footer from '@/app/admin/components/Footer'
import Link from 'next/link'
import Container from '@/app/admin/components/Container'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function EditComponent({ postId }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        newTitle: '',
        newImg: '',
        newContent: ''
    });

    useEffect(() => {
        if (!session) {
            router.push("/login");
            return;
        }
        if (session?.user?.role !== "admin") {
            router.push("/welcome");
            return;
        }
    }, [session, router]);

    useEffect(() => {
        const getPostById = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}`);
                const data = await res.json();
                const post = data.post;
                setFormData({
                    newTitle: post.title,
                    newImg: post.img,
                    newContent: post.content
                });
            } catch(error) {
                console.log(error);
            }
        };

        if (postId) getPostById();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin/posts");
            }
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <Container>
       <AdminNav session={session} />
       <div className='flex-grow bg-gradient-to-b from-white to-red-50'>
           <div className='max-w-4xl mx-auto px-4'>
               <div className='bg-white shadow-lg my-10 rounded-2xl overflow-hidden'>
                   <div className='bg-red-600 p-4 flex items-center'>
                       <Link 
                           href="/admin/posts" 
                           className='inline-flex items-center text-white hover:text-red-100 transition-colors duration-200'
                       >
                           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                           </svg>
                           Back to Posts
                       </Link>
                   </div>
                   
                   <div className='p-8'>
                       <h3 className='text-2xl font-bold text-red-600 mb-6'>Edit Post</h3>
                       <form onSubmit={handleSubmit} className='space-y-6'>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                               <input 
                                   type="text"
                                   value={formData.newTitle}
                                   onChange={(e) => setFormData({...formData, newTitle: e.target.value})}
                                   className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition duration-200'
                                   placeholder="Enter post title"
                               />
                           </div>

                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                               <input 
                                   type="text"
                                   value={formData.newImg}
                                   onChange={(e) => setFormData({...formData, newImg: e.target.value})}
                                   className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition duration-200'
                                   placeholder="Enter image URL"
                               />
                           </div>

                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                               <textarea 
                                   value={formData.newContent}
                                   onChange={(e) => setFormData({...formData, newContent: e.target.value})}
                                   rows="10"
                                   className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition duration-200'
                                   placeholder="Enter post content"
                               />
                           </div>

                           <button 
                               type='submit' 
                               className='w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center'
                           >
                               Update Post
                               <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                               </svg>
                           </button>
                       </form>
                   </div>
               </div>
           </div>
       </div>
       <Footer />
   </Container>
    );
}

export default EditComponent;