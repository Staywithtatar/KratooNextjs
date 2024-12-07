import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export async function GET(req, context) {
    try {
        const id = await Promise.resolve(context.params.id);
        await connectMongoDB();
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const id = await Promise.resolve(context.params.id);
        const { newName: name, newEmail: email, newPassword: password } = await req.json();
        
        await connectMongoDB();
        const updateData = { name, email };
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated", user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}