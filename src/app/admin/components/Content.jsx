import React from 'react'
import { FaUsers, FaRegNewspaper } from 'react-icons/fa6'

function Content({ totalUsersData, totalPostsData }) {
  return (
    <div className='px-10 rounded-lg'>
        <div className='flex'>
            <div className='bg-red-500 text-white w-[300px] m-3 p-10 rounded-lg shadow-lg'>
                <h3 className='flex items-center text-2xl font-bold mb-6'><FaUsers className='mr-2' /> Total Users</h3>
                <p className='text-5xl mt-4'>{totalUsersData?.length}</p>
            </div>
            <div className='bg-white w-[300px] m-3 p-10 rounded-lg shadow-lg border border-red-500'>
                <h3 className='flex items-center text-2xl font-bold text-red-500 mb-6'><FaRegNewspaper className='mr-2' /> Total Posts</h3>
                <p className='text-5xl mt-4 text-red-500'>{totalPostsData?.length}</p>
            </div>
        </div>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dolorem, natus repudiandae id quibusdam eos ea esse consectetur pariatur in vel vero, dolor ipsam placeat, excepturi qui quas consequatur officiis?
        </p>
    </div>
  )
}

export default Content