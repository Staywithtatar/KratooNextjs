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
            <div className='flex-grow'>
                <div className='container mx-auto bg-white shadow-lg my-10 p-8 rounded-lg'>
                    <Link href="/admin/users" className='bg-red-500 hover:bg-red-600 inline-block text-white py-2 px-4 rounded my-2 transition duration-200'>
                        Go back
                    </Link>
                    <hr className='my-6 border-gray-300' />
                    <h3 className='text-2xl font-bold mb-4 text-red-500'>Edit User</h3>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text"
                            value={formData.newName}
                            onChange={(e) => setFormData({...formData, newName: e.target.value})}
                            placeholder="Username"
                            className='w-full block bg-gray-100 border border-gray-300 py-2 px-4 rounded-md text-lg my-4'
                        />
                        <input 
                            type="email"
                            value={formData.newEmail}
                            onChange={(e) => setFormData({...formData, newEmail: e.target.value})}
                            placeholder="Email"
                            className='w-full block bg-gray-100 border border-gray-300 py-2 px-4 rounded-md text-lg my-4'
                        />
                        <input 
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            placeholder="New Password"
                            className='w-full block bg-gray-100 border border-gray-300 py-2 px-4 rounded-md text-lg my-4'
                        />
                        <button type='submit' className='bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md text-lg my-4 transition duration-200'>
                            Update User
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </Container>
    );
}

export default EditUserForm;