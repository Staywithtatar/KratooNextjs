import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        
        if (!email || !password) {
            return Response.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        // Return a safe response that doesn't expose sensitive data
        return Response.json({
            exists: true,
            passwordValid: isPasswordValid,
            // Include a hint about the password length to help debugging
            storedPasswordLength: user.password.length
        });

    } catch (error) {
        console.error("Password check error:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 