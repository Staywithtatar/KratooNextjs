import { connectMongoDB } from "../../../../../lib/mongodb";
import Post from "../../../../../models/strain";
import { NextResponse } from "next/server";

export async function GET(_, context) {
    try {
        const id = await Promise.resolve(context.params.id);
        await connectMongoDB();
        const post = await Post.findById(id);
        return NextResponse.json({ post });
    } catch(error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const id = await Promise.resolve(context.params.id);
        const { newTitle: title, newImg: img, newContent: content } = await req.json();
        await connectMongoDB();
        await Post.findByIdAndUpdate(id, { title, img, content });
        return NextResponse.json({ message: "Post updated" });
    } catch(error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}