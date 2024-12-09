import React from 'react'
import { FaUsers, FaRegNewspaper } from 'react-icons/fa6'

function Content({ totalUsersData, totalPostsData }) {
  return (
    <div className='px-10 py-6 rounded-xl'>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <h3 className='flex items-center text-2xl font-bold mb-4'>
                <FaUsers className='mr-3 text-red-100' /> 
                Total Users
            </h3>
            <p className='text-6xl font-bold mt-4'>{totalUsersData?.length || 0}</p>
        </div>
        <div className='bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-red-500'>
            <h3 className='flex items-center text-2xl font-bold text-red-500 mb-4'>
                <FaRegNewspaper className='mr-3' /> 
                Total Posts
            </h3>
            <p className='text-6xl font-bold text-red-500 mt-4'>{totalPostsData?.length || 0}</p>
        </div>
    </div>
    <p className='text-gray-600 leading-relaxed'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dolorem, natus repudiandae id quibusdam eos ea esse consectetur pariatur in vel vero, dolor ipsam placeat, excepturi qui quas consequatur officiis?
    </p>
</div>
  )
}

export default Content