import { connectMongoDB } from "../../../../../lib/mongodb";
import Post from "../../../../../models/post";
import { NextResponse } from "next/server";

// api/totalposts/[id]/route.js
export async function GET(req, { params }) {
    try {
        const id = await Promise.resolve(params.id);
        await connectMongoDB();
        const post = await Post.findById(id);
        return NextResponse.json({ post });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const id = await Promise.resolve(params.id);
        const { newTitle: title, newImg: img, newContent: content } = await req.json();
        await connectMongoDB();
        const updatedPost = await Post.findByIdAndUpdate(id, 
            { title, img, content }, 
            { new: true }
        );
        return NextResponse.json({ message: "Post updated", post: updatedPost });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}