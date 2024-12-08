// DeleteBtn.jsx
"use client"
import React from 'react'

function DeleteBtn({ id, onDelete }) {
    const handleDelete = async () => {
        if (confirm("Are you sure?")) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts?id=${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                onDelete(id); // Call function from parent instead of reloading
            }
        }
    }

    return (
        <button 
       onClick={handleDelete}
       className='inline-flex items-center px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors duration-200'
   >
       <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
       </svg>
       Delete
   </button>
    );
}

export default DeleteBtn