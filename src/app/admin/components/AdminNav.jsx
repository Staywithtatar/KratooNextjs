"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AdminNav({ session, onToggleSidebar }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-2xl border-b-4 border-green-600 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 md:h-20">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={onToggleSidebar}
                            className="mr-3 p-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link href="/admin" className="flex items-center group">
                            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg group-hover:shadow-green-400/50 transition-all duration-300 group-hover:scale-105">
                                <svg 
                                    className="w-6 h-6 md:w-8 md:h-8 text-white" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2L2 7v10c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V7l-10-5zM8 11c0-2.21 1.79-4 4-4s4 1.79 4 4v2h-8v-2zm8 6H8v-2h8v2z"/>
                                    <path d="M12 8c-1.1 0-2 .9-2 2v1h4v-1c0-1.1-.9-2-2-2z"/>
                                </svg>
                            </div>
                            <div className="ml-2 md:ml-4">
                                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                                    <span className="hidden sm:inline">GrandCannabistShop</span>
                                    <span className="sm:hidden">GCS</span>
                                </span>
                                <div className="text-xs text-green-200 font-medium tracking-wider hidden md:block">
                                    ADMIN PANEL
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center">
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <div className="text-sm font-medium text-white">
                                    Welcome back,
                                </div>
                                <div className="text-green-200 font-semibold truncate max-w-32">
                                    {session?.user?.name || session?.user?.email}
                                </div>
                            </div>
                            
                            <div className="h-10 w-px bg-green-600"></div>
                            
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                            >
                                <svg 
                                    className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-green-200 hover:bg-green-600/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-all duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-4 pt-4 pb-6 space-y-4 bg-gradient-to-b from-green-800 to-green-900 border-t border-green-600">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-4 bg-green-700/50 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white">
                                Welcome back,
                            </div>
                            <div className="text-green-200 font-semibold truncate">
                                {session?.user?.name || session?.user?.email}
                            </div>
                        </div>
                    </div>

                    

                    {/* Sign Out Button */}
                    <div className="pt-4 border-t border-green-600">
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                signOut({ callbackUrl: "/" });
                            }}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                        >
                            <svg 
                                className="w-5 h-5 mr-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}