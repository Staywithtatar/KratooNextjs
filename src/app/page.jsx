"use client"

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Container from './components/Container'
import Link from 'next/link'

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/welcome");
        }
    }, [status, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            setError("กรุณากรอกอีเมลและรหัสผ่าน");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                setIsLoading(false);
                return;
            }

            if (result?.ok) {
                router.replace("/welcome");
            }
        } catch (error) {
            console.log("Login error: ", error);
            setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
            setIsLoading(false);
        }
    }

    return (
        <Container>
            
            <div className='flex-grow bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen'>
                <div className='flex justify-center items-center min-h-screen py-4'>
                    <div className='w-[400px] bg-white/90 backdrop-blur-sm shadow-2xl p-6 rounded-3xl border border-green-200 relative overflow-hidden'>
                        
                        {/* Background decoration */}
                        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full -translate-y-16 translate-x-16'></div>
                        <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full translate-y-12 -translate-x-12'></div>
                        
                        <div className='relative z-10'>
                            {/* Header */}
                            <div className='text-center mb-6'>
                                <div className='flex justify-center mb-3'>
                                    <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg'>
                                        <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>
                                        </svg>
                                    </div>
                                </div>
                                <h1 className='text-2xl font-bold text-gray-800 mb-1'>เข้าสู่ระบบ</h1>
                                <h2 className='text-xl font-semibold text-green-600 mb-1'>GrandcannabistShop</h2>
                                <p className='text-sm text-gray-600'>ยินดีต้อนรับกลับ! เข้าสู่บัญชีของคุณ</p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {error && (
                                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative flex items-center animate-pulse'>
                                        <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <div className='space-y-3'>
                                    <label className='text-sm font-semibold text-gray-700 flex items-center'>
                                        <svg className='w-4 h-4 mr-2 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                            <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                                            <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                                        </svg>
                                        อีเมล
                                    </label>
                                    <input 
                                        type="email" 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className='w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 hover:bg-gray-100'
                                        placeholder='กรุณากรอกอีเมล' 
                                        value={email}
                                    />
                                </div>

                                <div className='space-y-3'>
                                    <label className='text-sm font-semibold text-gray-700 flex items-center'>
                                        <svg className='w-4 h-4 mr-2 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                                        </svg>
                                        รหัสผ่าน
                                    </label>
                                    <input 
                                        type="password" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className='w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 hover:bg-gray-100'
                                        placeholder='กรุณากรอกรหัสผ่าน'
                                        value={password}
                                    />
                                </div>

                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500'
                                        />
                                        <label
                                            htmlFor="remember"
                                            className='ml-2 text-sm text-gray-700'
                                        >
                                            จดจำฉัน
                                        </label>
                                    </div>
                                    <Link
                                        href="/forgot-password"
                                        className='text-sm text-green-600 hover:text-green-700 hover:underline transition duration-200'
                                    >
                                        ลืมรหัสผ่าน?
                                    </Link>
                                </div>

                                <button 
                                    type='submit'
                                    disabled={isLoading}
                                    className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                            </svg>
                                            <span>กำลังเข้าสู่ระบบ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>เข้าสู่ระบบ</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>

                                {/* Social Login Options */}
                                <div className='relative my-6'>
                                    <div className='absolute inset-0 flex items-center'>
                                        <div className='w-full border-t border-gray-300'></div>
                                    </div>
                                    <div className='relative flex justify-center text-sm'>
                                        <span className='px-2 bg-white text-gray-500'>หรือเข้าสู่ระบบด้วย</span>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-2'>
                                    <button
                                        type='button'
                                        className='flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200'
                                    >
                                        <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                                            <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
                                            <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                                            <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                                            <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
                                        </svg>
                                        Google
                                    </button>
                                    <button
                                        type='button'
                                        className='flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200'
                                    >
                                        <svg className='w-5 h-5 mr-2' fill='#1877F2' viewBox='0 0 24 24'>
                                            <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                                        </svg>
                                        Facebook
                                    </button>
                                </div>

                                <div className='text-center mt-6 pt-4 border-t border-gray-200'>
                                    <p className='text-gray-600'>
                                        ยังไม่มีบัญชีผู้ใช้?{' '}
                                        <Link href="/register" className='text-green-600 font-semibold hover:text-green-700 hover:underline transition duration-200'>
                                            สมัครสมาชิกที่นี่
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
           
        </Container>
    )
}

export default LoginPage