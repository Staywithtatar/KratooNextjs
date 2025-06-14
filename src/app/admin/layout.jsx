"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "./components/AdminNav";
import SideNav from "./components/SideNav";

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session?.user?.role !== "admin") {
            router.push("/welcome");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session || session.user.role !== "admin") {
        return null;
    }

    return (
        <div className="min-h-screen">
            <AdminNav 
                session={session} 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />
            <SideNav 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />
            <main className={`p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : ''}`}>
                {children}
            </main>
        </div>
    );
} 