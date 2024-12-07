"use client"

import React from 'react'

function DeleteBtn({ id, onDelete }) {
    const handleDelete = async () => {
        if (confirm("Are you sure?")) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers?id=${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                onDelete(id);
            }
        }
    }

    return (
        <button onClick={handleDelete} className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-lg my-2 ml-2 transition duration-200'>
        Delete
    </button>
    );
}

export default DeleteBtn