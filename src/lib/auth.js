import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "./mongodb";
import User from "../models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Auth attempt with email:", credentials.email);
                
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
                }

                try {
                    await connectMongoDB();
                    console.log("MongoDB connected successfully");

                    const user = await User.findOne({ email: credentials.email });
                    console.log("User lookup result:", user ? "User found" : "User not found");

                    if (!user) {
                        throw new Error("ไม่พบผู้ใช้งานนี้");
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    console.log("Password validation result:", isPasswordValid ? "Valid" : "Invalid");

                    if (!isPasswordValid) {
                        throw new Error("รหัสผ่านไม่ถูกต้อง");
                    }

                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: "/",
        error: "/"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};

// Create and export the handler
const handler = NextAuth(authOptions);
export { handler }; 