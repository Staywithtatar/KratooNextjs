// components/AllPosts.jsx
"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'

function AllPosts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`)
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
        <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 overflow-hidden h-[480px] flex flex-col border border-blue-50">
                    {/* Image Section */}
                    {post.img && (
                        <div className="h-48 relative">
                            <Image 
                                src={post.img}
                                alt={post.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                        {/* Author Info */}
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                    {post.userEmail.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-900">{post.userEmail}</p>
                                <p className="text-xs text-blue-500">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Title & Content */}
                        <h3 className="text-lg font-bold text-blue-900 mb-2 line-clamp-2 hover:text-blue-700 transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            {post.content}
                        </p>

                        {/* Footer */}
                        <div className="mt-auto pt-3 border-t border-blue-50">
                            <div className="flex items-center justify-between text-sm text-blue-500">
                                <div className="flex space-x-4">
                                    <span className="flex items-center hover:text-blue-600 transition-colors">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        0
                                    </span>
                                    <span className="flex items-center hover:text-blue-600 transition-colors">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        0
                                    </span>
                                </div>
                                <button className="p-1 hover:bg-blue-50 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    )
}

export default AllPosts