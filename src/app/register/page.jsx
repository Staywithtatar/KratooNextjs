"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '../components/Container'
import Link from 'next/link'

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            setIsLoading(false);
            return;
        }

        if (!name || !email || !password || !confirmPassword) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            setIsLoading(false);
            return;
        }

        try {
            // Check if user exists
            const resUserExists = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/userExists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const { user } = await resUserExists.json();

            if (user) {
                setError("อีเมลนี้ถูกใช้งานแล้ว");
                setIsLoading(false);
                return;
            }
             
            // Register user
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ GrandcannabistShop");
                const form = e.target;
                form.reset();
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } else {
                setError(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
            }
        } catch(error) {
            console.log("Error during registration:", error);
            setError("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        } finally {
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
                                            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/>
                                        </svg>
                                    </div>
                                </div>
                                <h1 className='text-2xl font-bold text-gray-800 mb-1'>สมัครสมาชิก</h1>
                                <h2 className='text-xl font-semibold text-green-600 mb-1'>GrandcannabistShop</h2>
                                <p className='text-sm text-gray-600'>เข้าร่วมกับเราเพื่อสัมผัสประสบการณ์ที่ดีที่สุด</p>
                            </div>

                            <form onSubmit={handlesubmit} className='space-y-4'>
                                {error && (
                                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative flex items-center'>
                                        <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl relative flex items-center'>
                                        <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                        </svg>
                                        {success}
                                    </div>
                                )}

                                <div className='space-y-2'>
                                    <label className='text-sm font-semibold text-gray-700 flex items-center'>
                                        <svg className='w-4 h-4 mr-2 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                                        </svg>
                                        ชื่อ-นามสกุล
                                    </label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setName(e.target.value)} 
                                        className='w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 hover:bg-gray-100'
                                        placeholder='กรุณากรอกชื่อ-นามสกุล' 
                                    />
                                </div>

                                <div className='space-y-2'>
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
                                    />
                                </div>

                                <div className='space-y-2'>
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
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-semibold text-gray-700 flex items-center'>
                                        <svg className='w-4 h-4 mr-2 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                                        </svg>
                                        ยืนยันรหัสผ่าน
                                    </label>
                                    <input 
                                        type="password" 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        className='w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 hover:bg-gray-100'
                                        placeholder='กรุณายืนยันรหัสผ่าน' 
                                    />
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
                                            <span>กำลังสมัครสมาชิก...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>สร้างบัญชีผู้ใช้</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>

                                <div className='text-center mt-6 pt-4 border-t border-gray-200'>
                                    <p className='text-gray-600'>
                                        มีบัญชีผู้ใช้แล้ว?{' '}
                                        <Link href="/" className='text-green-600 font-semibold hover:text-green-700 hover:underline transition duration-200'>
                                            เข้าสู่ระบบที่นี่
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

export default RegisterPage