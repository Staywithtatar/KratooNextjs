"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/welcome");
        }
    }, [status, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email, 
                password,
                redirect: false
            });

            if (res?.error) {
                setError("Invalid Credentials");
                return;
            }

            if (res?.ok) {
                router.replace("/welcome");
            }
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <Container>
           <Navbar />
           <div className='flex-grow bg-gradient-to-b from-white to-blue-50'>
               <div className='flex justify-center items-center min-h-[80vh]'>
                   <div className='w-[400px] bg-white shadow-lg p-10 rounded-2xl border border-blue-100'>
                       <h3 className='text-3xl font-bold text-blue-900 mb-2'>Login</h3>
                       <p className='text-blue-600 mb-6'>Welcome back! Please login to your account.</p>
                       
                       <form onSubmit={handleSubmit} className='space-y-4'>
                           {error && (
                               <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                                   {error}
                               </div>
                           )}

                           <div className='space-y-2'>
                               <label className='text-sm font-medium text-blue-900'>Email</label>
                               <input 
                                   type="text" 
                                   onChange={(e) => setEmail(e.target.value)} 
                                   className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                                   placeholder='Enter your email' 
                               />
                           </div>

                           <div className='space-y-2'>
                               <label className='text-sm font-medium text-blue-900'>Password</label>
                               <input 
                                   type="password" 
                                   onChange={(e) => setPassword(e.target.value)} 
                                   className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                                   placeholder='Enter your password' 
                               />
                           </div>

                           <button 
                               type='submit'
                               className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2'
                           >
                               <span>Sign In</span>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                   <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                               </svg>
                           </button>

                           <div className='text-center mt-6'>
                               <p className='text-blue-600'>
                                   Don't have an account? {' '}
                                   <Link href="/register" className='text-blue-800 font-semibold hover:underline'>
                                       Register here
                                   </Link>
                               </p>
                           </div>
                       </form>
                   </div>
               </div>
           </div>
           <Footer />
       </Container>
    )
}

export default LoginPage