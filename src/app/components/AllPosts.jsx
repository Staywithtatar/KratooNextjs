// components/AllPosts.jsx
"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'

function AllPosts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/totalposts')
                const data = await res.json()
                setPosts(data.totalPosts)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Latest Posts</h2>
            <div className="grid gap-8">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">
                                        {post.userEmail.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">{post.userEmail}</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-blue-900 mb-3">{post.title}</h3>
                            {post.img && (
                                <div className="mb-4 relative h-64 rounded-lg overflow-hidden">
                                    <img 
                                        src={post.img}
                                        alt={post.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <p className="text-gray-600 leading-relaxed mb-4">{post.content}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex space-x-4">
                                    <span>💬 0 comments</span>
                                    <span>👁️ 0 views</span>
                                </div>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllPosts