// components/Comments.jsx
"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export default function Comments({ postId }) {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { data: session } = useSession()

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments?postId=${postId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch comments')
            }
            const data = await response.json()
            setComments(data.comments)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [postId])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    postId,
                    authorId: session.user.id
                })
            })

            if (res.ok) {
                setNewComment('')
                fetchComments()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            
            {/* Comment Form */}
            {session && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Write a comment..."
                        rows="3"
                    />
                    <button 
                        type="submit"
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Post Comment
                    </button>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
    {comments.map((comment) => (
        <CommentItem
            key={comment._id}
            comment={comment}
            onReply={fetchComments}
            nesting={0}
        />
    ))}
</div>
        </div>
    )
}

// Comment Item Component
function CommentItem({ comment, onReply }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const { data: session } = useSession();

    const handleReply = async (e) => {
        e.preventDefault()
        if (!replyContent.trim()) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: replyContent,
                    postId: comment.postId,
                    authorId: session.user.id,
                    parentId: comment._id
                })
            })

            if (res.ok) {
                setReplyContent('')
                setIsReplying(false)
                onReply()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="border-l-2 border-gray-200 pl-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <div className="font-semibold">{comment.author.name}</div>
                    <div className="text-sm text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
                
            </div>

            {/* Reply Form */}
            {isReplying && (
                <form onSubmit={handleReply} className="mt-2">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Write a reply..."
                    />
                    <div className="flex gap-2 mt-2">
                        <button 
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Reply
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsReplying(false)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Nested Replies */}
            {comment.replies?.length > 0 && (
                <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map(reply => (
                        <CommentItem 
                            key={reply._id}  // เพิ่ม key prop ตรงนี้
                            comment={reply}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}