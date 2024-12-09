// app/api/comments/route.js
import { connectMongoDB } from "../../../../lib/mongodb";
import Comment from "../../../../models/comment";
import { NextResponse } from "next/server";
import User from "../../../../models/user";

export async function GET(req) {
    try {
        const postId = req.nextUrl.searchParams.get("postId");
        await connectMongoDB();
        const comments = await Comment.find({ postId }).populate('author', 'name email');
        return NextResponse.json({ comments });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
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