"use client"

import React, { useState, useEffect } from 'react'
import AdminNav from './components/AdminNav'
import Container from './components/Container'
import Footer from './components/Footer'
import SideNav from './components/SideNav'
import Content from './components/Content'

import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation' 

function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [totalUsersData, setTotalUsersData] = useState([]);
    const [totalPostsData, setTotalPostsData] = useState([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (session?.user?.role !== 'admin') {
            router.push('/welcome');
        }
    }, [session, status, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, postsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`),
                    fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`)
                ]);

                const [usersData, postsData] = await Promise.all([
                    usersRes.json(),
                    postsRes.json()
                ]);

                setTotalUsersData(usersData.totalUsers || []);
                setTotalPostsData(postsData.totalPosts || []);
            } catch(error) {
                console.log("Error:", error);
            }
        };

        if (session?.user?.role === 'admin') {
            fetchData();
        }
    }, [session]);

    return (
        <Container>
            <AdminNav session={session} />
            <div className='flex-grow'>
                <div className='container mx-auto'>
                    <div className='flex justify-between mt-10'>
                        <SideNav />
                        <Content 
                            totalUsersData={totalUsersData} 
                            totalPostsData={totalPostsData}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </Container>
    );
}

export default AdminPage;