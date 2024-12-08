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
        <div className='flex-grow bg-gradient-to-b from-white to-red-50'>
            <div className='container mx-auto px-4'>
                <div className='flex mt-10 space-x-6'>
                    <SideNav />
                    <div className='p-8 bg-white rounded-2xl shadow-lg flex-grow'>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className='text-3xl font-bold text-red-600 mb-2'>Manage Users</h3>
                                <p className='text-gray-600'>A list of users from MongoDB database</p>
                            </div>
                        </div>

                        <div className='overflow-x-auto mt-6'>
                            <table className='w-full border-collapse bg-white shadow-sm rounded-lg'>
                                <thead>
                                    <tr className='bg-red-600 text-white uppercase text-sm'>
                                        <th className='px-6 py-4 font-semibold'>ID</th>
                                        <th className='px-6 py-4 font-semibold'>Username</th>
                                        <th className='px-6 py-4 font-semibold'>Email</th>
                                        <th className='px-6 py-4 font-semibold'>Role</th>
                                        <th className='px-6 py-4 font-semibold'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {allUsersData?.map(val => (
                                        <tr key={val._id} className='hover:bg-red-50 transition-colors duration-200'>
                                            <td className='px-6 py-4 whitespace-nowrap'>{val._id}</td>
                                            <td className='px-6 py-4'>{val.name}</td>
                                            <td className='px-6 py-4'>{val.email}</td>
                                            <td className='px-6 py-4'>
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    val.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {val.role}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div className="flex space-x-2">
                                                    <Link 
                                                        href={`/admin/users/edit/${val._id}`}
                                                        className='inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
                                                    >
                                                        Edit
                                                    </Link>
                                                    <DeleteBtn id={val._id} onDelete={handleDelete} />
                                                </div>
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