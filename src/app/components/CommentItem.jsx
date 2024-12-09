// components/CommentItem.jsx
"use client"
import { useState } from 'react'
import { useSession } from 'next-auth/react'

function CommentItem({ comment, onReply, nesting = 0 }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const { data: session } = useSession();

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: replyContent,
                    postId: comment.postId,
                    parentId: comment._id,
                })
            });

            if (res.ok) {
                setReplyContent('');
                setIsReplying(false);
                if (onReply) onReply();
            }
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    // Limit nesting level
    const canReply = nesting < 3;

    return (
        <div className="border-l-2 border-gray-200 pl-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                            {comment.author?.name?.[0] || 'A'}
                        </span>
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                            {comment.author?.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-2">{comment.content}</p>

                {session && canReply && (
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Reply
                    </button>
                )}
            </div>

            {isReplying && (
                <form onSubmit={handleReply} className="mt-3 pl-8">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="Write a reply..."
                    />
                    <div className="mt-2 flex gap-2">
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Post Reply
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsReplying(false)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            onReply={onReply}
                            nesting={nesting + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentItem;