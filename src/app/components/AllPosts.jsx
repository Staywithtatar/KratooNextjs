// components/AllPosts.jsx
"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [postComments, setPostComments] = useState({});

    const fetchComments = async (postId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments?postId=${postId}`);
            const data = await res.json();
            setPostComments(prev => ({
                ...prev,
                [postId]: data.comments
            }));
        } catch (error) {
            console.log("Error fetching comments:", error);
        }
    };

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

    useEffect(() => {
        const fetchPostsAndComments = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`);
                const data = await res.json();
                setPosts(data.totalPosts);
                
                // ดึงคอมเม้นต์สำหรับแต่ละโพสต์
                data.totalPosts.forEach(post => fetchComments(post._id));
            } catch (error) {
                console.log(error);
            }
        };
        fetchPostsAndComments();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-blue-900 mb-4">Posts</h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <div key={post._id} 
                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-blue-100"
                    >
                        {/* Image Section */}
                        {post.img && (
                            <div className="relative h-56 overflow-hidden">
                                <Image 
                                    src={post.img}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        )}
                        
                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-grow">
                            {/* Author Info */}
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center ring-2 ring-blue-50">
                                    <span className="text-lg font-bold text-blue-600">
                                        {post.userEmail.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-blue-900">{post.userEmail}</p>
                                    <p className="text-sm text-blue-500">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Title & Content */}
                            
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                                    {post.content}
                                </p>
                         

                            {/* Comments Section */}
                            <div className="mt-auto pt-4 border-t border-blue-50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Link href={`/post/${post._id}`} className="group flex-grow">
                                        <span className="flex items-center text-blue-600">
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                           </svg>
                                            <span className="font-medium">{postComments[post._id]?.length || 0}</span>
                                         </span>
                                        </Link>
                                         </div>
                                </div>       
                                            
                                {/* Comments Preview */}
                                {postComments[post._id]?.length > 0 && (
                                    <div className="space-y-2">
                                        {postComments[post._id].slice(0, 2).map((comment) => (
                                            <div key={comment._id} 
                                                className="bg-blue-50 p-3 rounded-lg transition-all hover:bg-blue-100"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-blue-700">
                                                            {comment.author.name?.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-sm text-gray-700 line-clamp-2">{comment.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {postComments[post._id].length > 2 && (
                                            <Link 
                                                href={`/post/${post._id}`}
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                View all {postComments[post._id].length} comments
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllPosts