"use client"

import React, { useState, useEffect } from 'react'
import AdminNav from '../components/AdminNav'
import Footer from '../components/Footer'
import SideNav from '../components/SideNav'
import Container from '../components/Container'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import DeleteBtn from './DeleteBtn'

function AdminUserManagePage() {
    const { data: session } = useSession();
    const [allUsersData, setAllUsersData] = useState([]);

    useEffect(() => {
        if (!session || session?.user?.role !== "admin") return;

        const getAllUsersData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`);
                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await res.json();
                setAllUsersData(data.totalUsers);
            } catch(error) {
                console.log("Error loading users:", error);
            }
        };

        getAllUsersData();
    }, []);

    const handleDelete = (deletedId) => {
        setAllUsersData(prevUsers => prevUsers.filter(user => user._id !== deletedId));
    };

    if (!session) return redirect("/login");
    if (session?.user?.role !== "admin") return redirect("/welcome");

    return (
        <Container>
        <AdminNav session={session} />
        <div className='flex-grow'>
            <div className='container mx-auto'>
                <div className='flex mt-10'>
                    <SideNav />
                    <div className='p-8 bg-white rounded-lg shadow-lg flex-grow'>
                        <h3 className='text-3xl font-bold mb-4 text-red-500'>Manage Users</h3>
                        <p className='text-gray-600'>A list of users retrieved from a MongoDB database</p>
                        <div className='overflow-x-auto mt-6'>
                            <table className='table-auto w-full text-left rounded-lg'>
                                <thead>
                                    <tr className='bg-red-500 text-white'>
                                        <th className='p-4'>ID</th>
                                        <th className='p-4'>Username</th>
                                        <th className='p-4'>Email</th>
                                        <th className='p-4'>Role</th>
                                        <th className='p-4'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsersData?.map(val => (
                                        <tr key={val._id} className='border-b border-gray-200 hover:bg-gray-100'>
                                            <td className='p-4'>{val._id}</td>
                                            <td className='p-4'>{val.name}</td>
                                            <td className='p-4'>{val.email}</td>
                                            <td className='p-4'>{val.role}</td>
                                            <td className='p-4'>
                                                <Link className='bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-lg transition duration-200' href={`/admin/users/edit/${val._id}`}>
                                                    Edit
                                                </Link>
                                                <DeleteBtn id={val._id} onDelete={handleDelete} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </Container>
    );
}
export default AdminUserManagePage