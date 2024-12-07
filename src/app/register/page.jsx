"use client"

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'
import Link from 'next/link'

function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setError("Password do not match");
            return;
        }

        if (!name || !email || !password || !confirmPassword) {
            setError("Please complete all inputs");
            return;
        }

        try {

            const resUserExists = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/userExists`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })

            })

            const { user } = await resUserExists.json();

            if (user) {
                setError("User already exists.");
                return;
            }
             
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/register`,{
                method: "POST",
                header: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            })

            if (res.ok) {
                  const form = e.target;
                  setError("");
                  setSuccess("User registered successfully.")
                  form.reset();  
            } else {
                console.log("User registration failed.");
            }

        } catch(error) {
            console.log("Error during registration", error)
        }
    }

  return (
    <Container>
           <Navbar />
           <div className='flex-grow bg-gradient-to-b from-white to-blue-50'>
               <div className='flex justify-center items-center min-h-[80vh]'>
                   <div className='w-[400px] bg-white shadow-lg p-10 rounded-2xl border border-blue-100'>
                       <h3 className='text-3xl font-bold text-blue-900 mb-2'>Register</h3>
                       <p className='text-blue-600 mb-6'>Create your account to get started!</p>

                       <form onSubmit={handlesubmit} className='space-y-4'>
                           {error && (
                               <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                                   {error}
                               </div>
                           )}

                           {success && (
                               <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative'>
                                   {success}
                               </div>
                           )}

                           <div className='space-y-2'>
                               <label className='text-sm font-medium text-blue-900'>Name</label>
                               <input 
                                   type="text" 
                                   onChange={(e) => setName(e.target.value)} 
                                   className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                                   placeholder='Enter your name' 
                               />
                           </div>

                           <div className='space-y-2'>
                               <label className='text-sm font-medium text-blue-900'>Email</label>
                               <input 
                                   type="email" 
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

                           <div className='space-y-2'>
                               <label className='text-sm font-medium text-blue-900'>Confirm Password</label>
                               <input 
                                   type="password" 
                                   onChange={(e) => setConfirmPassword(e.target.value)} 
                                   className='w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                                   placeholder='Confirm your password' 
                               />
                           </div>

                           <button 
                               type='submit'
                               className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2'
                           >
                               <span>Create Account</span>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                               </svg>
                           </button>

                           <div className='text-center mt-6'>
                               <p className='text-blue-600'>
                                   Already have an account? {' '}
                                   <Link href="/login" className='text-blue-800 font-semibold hover:underline'>
                                       Login here
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

export default RegisterPage