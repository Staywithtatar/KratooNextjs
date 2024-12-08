"use client"
// app/admin/users/edit/[id]/EditUserForm.jsx
import { useState, useEffect } from 'react'
import AdminNav from '@/app/admin/components/AdminNav'
import Footer from '@/app/admin/components/Footer'
import Container from '@/app/admin/components/Container'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function EditUserForm({ userId }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        newName: '',
        newEmail: '',
        newPassword: ''
    });
    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        if (!session) {
            router.push("/login");
            return;
        }
        if (session?.user?.role !== "admin") {
            router.push("/welcome");
            return;
        }
    }, [session, router]);

    useEffect(() => {
        const getUserById = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                
                if (data.user) {
                    setOriginalData(data.user);
                    setFormData({
                        newName: data.user.name || '',
                        newEmail: data.user.email || '',
                        newPassword: ''
                    });
                }
            } catch(error) {
                console.log("Error fetching user:", error);
                router.push("/admin/users");
            }
        };

        if (userId) getUserById();
    }, [userId, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate form data
            if (!formData.newName || !formData.newEmail) {
                alert("Name and email are required");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update user");
            }

            router.push("/admin/users");
        } catch(error) {
            console.log("Error updating user:", error);
            alert(error.message);
        }
    };

 

    return (
        <Container>
        <AdminNav session={session} />
        <div className='flex-grow bg-gradient-to-b from-white to-red-50'>
            <div className='max-w-3xl mx-auto'>
                <div className='bg-white shadow-lg my-10 rounded-2xl overflow-hidden'>
                    <div className='bg-red-600 px-8 py-4'>
                        <Link 
                            href="/admin/users" 
                            className='inline-flex items-center text-white hover:text-red-100 transition-colors duration-200'
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Back to Users
                        </Link>
                    </div>
                    
                    <div className='p-8'>
                        <h3 className='text-2xl font-bold text-red-600 mb-6'>Edit User</h3>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <input 
                                    type="text"
                                    value={formData.newName}
                                    onChange={(e) => setFormData({...formData, newName: e.target.value})}
                                    className='w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200'
                                    placeholder="Enter username"
                                />
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input 
                                    type="email"
                                    value={formData.newEmail}
                                    onChange={(e) => setFormData({...formData, newEmail: e.target.value})}
                                    className='w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200'
                                    placeholder="Enter email"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input 
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                    className='w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200'
                                    placeholder="Enter new password"
                                />
                            </div>

                            <button 
                                type='submit' 
                                className='w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center'
                            >
                                Update User
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </Container>
    );
}

export default EditUserForm;