"use client"

import React from 'react'

function DeleteBtn({ id, onDelete }) {
    const handleDelete = async () => {
        if (confirm("Are you sure?")) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                onDelete(id);
            }
        }
    }
 
    return (
        <button 
            onClick={handleDelete} 
            className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 inline-flex items-center gap-2'>
            <span>Delete</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        </button>
    );
 }

export default DeleteBtn