// app/admin/posts/edit/[id]/EditComponent.jsx
"use client"
import { useState, useEffect } from 'react'
import AdminNav from '@/app/admin/components/AdminNav'
import Footer from '@/app/admin/components/Footer'
import Link from 'next/link'
import Container from '@/app/admin/components/Container'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function EditComponent({ postId }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        newTitle: '',
        newImg: '',
        newContent: ''
    });

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
        const getPostById = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}`);
                const data = await res.json();
                const post = data.post;
                setFormData({
                    newTitle: post.title,
                    newImg: post.img,
                    newContent: post.content
                });
            } catch(error) {
                console.log(error);
            }
        };

        if (postId) getPostById();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin/posts");
            }
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <Container>
        <AdminNav session={session} />
        <div className='flex-grow'>
            <div className='container mx-auto bg-white shadow-lg my-10 p-8 rounded-lg'>
                <Link href="/admin/posts" className='bg-red-500 hover:bg-red-600 inline-block text-white py-2 px-4 rounded my-2 transition duration-200'>
                    Go back
                </Link>
                <hr className='my-6 border-gray-300' />
                <h3 className='text-2xl font-bold mb-4 text-red-500'>Edit Post</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        value={formData.newTitle}
                        onChange={(e) => setFormData({...formData, newTitle: e.target.value})}
                        className='w-full block bg-gray-100 border border-gray-300 py-2 px-4 rounded-md text-lg my-4'
                        placeholder="Title"
                    />
                    <input 
                        type="text"
                        value={formData.newImg}
                        onChange={(e) => setFormData({...formData, newImg: e.target.value})}
                        className='w-full block bg-gray-100 border border-gray-300 py-2 px-4 rounded-md text-lg my-4'
                        placeholder="Image URL"
                    />
                    <textarea
                        value={formData.newContent}
                        onChange={(e) => setFormData({...formData, newContent: e.target.value})}
                        className='w-full block bg-gray-100 border border-gray-300 py-2 px-4 rounded-md text-lg my-4'
                        rows="10"
                        placeholder="Content"
                    ></textarea>
                    <button type='submit' className='bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md text-lg my-4 transition duration-200'>
                        Update Post
                    </button>
                </form>
            </div>
        </div>
        <Footer />
    </Container>
    );
}

export default EditComponent;