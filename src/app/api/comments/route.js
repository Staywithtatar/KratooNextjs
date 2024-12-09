// app/api/comments/route.js
import { connectMongoDB } from "../../../../lib/mongodb";
import Comment from "../../../../models/comment";
import { NextResponse } from "next/server";

// Get comments for a post
export async function GET(req) {
    const postId = req.nextUrl.searchParams.get("postId");
    await connectMongoDB();
    const comments = await Comment.find({ postId })
        .populate('author', 'name email')
        .populate({
            path: 'replies',
            populate: { path: 'author', select: 'name email' }
        })
        .sort({ createdAt: -1 });
    return NextResponse.json({ comments });
}

// Create new comment
export async function POST(req) {
    const { content, postId, authorId, parentId } = await req.json();
    await connectMongoDB();
    
    const comment = await Comment.create({
        content,
        postId,
        author: authorId,
        parentId
    });

    if (parentId) {
        await Comment.findByIdAndUpdate(parentId, {
            $push: { replies: comment._id }
        });
    }

    return NextResponse.json({ comment }, { status: 201 });
}