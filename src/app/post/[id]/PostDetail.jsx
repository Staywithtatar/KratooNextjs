"use client"
import { useState, useEffect } from 'react'
import Container from '@/app/components/Container'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import Comments from '@/app/components/Comments'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function PostDetail({ postId }) {
    const { data: session } = useSession()
    const [post, setPost] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${postId}`)
                const data = await res.json()
                setPost(data.post)
            } catch (error) {
                console.error(error)
            }
        }
        fetchPost()
    }, [postId])

    if (!post) return <div>Loading...</div>

    return (
        <Container>
            <Navbar session={session} />
            <div className="flex-grow bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>
                            {post.img && (
                                <div className="relative w-full h-64 mb-6">
                                    <Image
                                        src={post.img}
                                        alt={post.title}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {post.content}
                            </p>
                            <div className="text-sm text-gray-500">
                                Posted by {post.userEmail}
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-100 p-6">
                            <Comments postId={postId} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Container>
    )
}