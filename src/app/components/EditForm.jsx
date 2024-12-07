"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Container from './Container'
import Navbar from './Navbar'
import Footer from './Footer'
import Link from 'next/link'

export default function EditForm({ postId }) {
  const [formData, setFormData] = useState({
    newTitle: '',
    newImg: '',
    newContent: ''
  })
  const router = useRouter()

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}`)
        const data = await res.json()
        if (data.post) {
          setFormData({
            newTitle: data.post.title || '',
            newImg: data.post.img || '',
            newContent: data.post.content || ''
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
    getPost()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) router.push('/welcome')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
     <Navbar />
     <div className='flex-grow bg-gradient-to-b from-white to-blue-50'>
       <div className='max-w-3xl mx-auto bg-white shadow-lg my-10 p-8 rounded-2xl'>
         <Link href="/welcome" 
           className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300'>
           <span>← Back</span>
         </Link>
         
         <hr className='my-6 border-blue-100' />
         
         <h3 className='text-2xl font-bold text-blue-900 mb-6'>Edit Post</h3>
         
         <form onSubmit={handleSubmit} className='space-y-4'>
           <input
             type="text"  
             value={formData.newTitle}
             onChange={(e) => setFormData({...formData, newTitle: e.target.value})}
             className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
             placeholder='Post title'
           />
           
           <input
             type="text"
             value={formData.newImg}
             onChange={(e) => setFormData({...formData, newImg: e.target.value})}
             className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
             placeholder='Post Image URL'
           />
           
           <textarea
             value={formData.newContent}
             onChange={(e) => setFormData({...formData, newContent: e.target.value})}
             className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
             placeholder='Enter your post content'
             rows="10"
           />
           
           <button 
             type='submit'
             className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2'
           >
             <span>Update Post</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
             </svg>
           </button>
         </form>
       </div>
     </div>
     <Footer />
   </Container>
  )
}