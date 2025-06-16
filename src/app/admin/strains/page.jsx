"use client"

import React, { useState, useEffect } from 'react'
import Container from '../../components/Container'
import { useRouter } from 'next/navigation'

function StrainsPage() {
    const [strains, setStrains] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStrain, setEditingStrain] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "Indica",
        thcPercent: "",
        stock: "",
        price: "",
        notes: ""
    });

    const router = useRouter();

    useEffect(() => {
        fetchStrains();
    }, []);

    const fetchStrains = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/strains`);
            const data = await res.json();
            if (res.ok) {
                // Ensure data is an array and filter out any null/undefined entries
                setStrains(Array.isArray(data) ? data.filter(s => s) : []);
            } else {
                setError("ไม่สามารถโหลดข้อมูลสายพันธุ์ได้");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use _id for Google Sheets backend (row index)
            const url = editingStrain 
                ? `${process.env.NEXT_PUBLIC_URL}/api/strains/${editingStrain._id}`
                : `${process.env.NEXT_PUBLIC_URL}/api/strains`;
            
            const method = editingStrain ? "PUT" : "POST";
            
            // Convert numeric fields to numbers
            const submitData = {
                ...formData,
                thcPercent: parseFloat(formData.thcPercent),
                stock: parseFloat(formData.stock),
                price: parseFloat(formData.price)
            };
            
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(submitData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingStrain(null);
                setFormData({
                    name: "",
                    type: "Indica",
                    thcPercent: "",
                    stock: "",
                    price: "",
                    notes: ""
                });
                fetchStrains();
            } else {
                const data = await res.json();
                setError(data.message || "ไม่สามารถบันทึกข้อมูลได้");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleDelete = async (_id) => {
        if (!confirm("คุณแน่ใจหรือไม่ที่จะลบสายพันธุ์นี้?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/strains/${_id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                fetchStrains();
            } else {
                setError("ไม่สามารถลบข้อมูลได้");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    };

    const handleEdit = (strain) => {
        setEditingStrain({...strain}); 
        setFormData({
            name: strain.name,
            type: strain.type,
            thcPercent: (strain.thcPercent ?? '').toString(),
            stock: (strain.stock ?? '').toString(),
            price: (strain.price ?? '').toString(),
            notes: strain.notes || ""
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingStrain(null);
        setFormData({
            name: "",
            type: "Indica",
            thcPercent: "",
            stock: "",
            price: "",
            notes: ""
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStrain(null);
        setError(""); // Clear any form errors
    };

    return (
        <Container>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">จัดการสายพันธุ์กัญชา</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                รายการสายพันธุ์กัญชาทั้งหมดในระบบ
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                onClick={resetForm}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                            >
                                เพิ่มสายพันธุ์ใหม่
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                            {error}
                            <button
                                onClick={() => setError("")}
                                className="absolute top-0 right-0 mt-2 mr-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                        </div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        ชื่อสายพันธุ์
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        ประเภท
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                         THC%
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        สต็อก
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        ราคา
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        หมายเหตุ
                                                    </th>
                                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                        <span className="sr-only">จัดการ</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {strains.map((strain) => {
                                                    console.log("Strain object:", strain);
                                                    console.log("Strain price:", strain?.price);
                                                    return (
                                                    strain && <tr key={strain._id}> 
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {strain.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {strain.type === 'Indica' ? 'อินดิกา' : 
                                                             strain.type === 'Sativa' ? 'ซาติวา' : 'ไฮบริด'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {`${String(strain.thcPercent || '')}%`}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {`${String(strain.stock || '')} กรัม`}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {`${String(strain.price || '')} บาท`}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {strain.notes || 'N/A'}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <button
                                                                onClick={() => handleEdit(strain)} 
                                                                className="text-green-600 hover:text-green-900 mr-4"
                                                            >
                                                                แก้ไข
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(strain._id)} 
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                ลบ
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );})}
                                                {strains.length === 0 && !isLoading && (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                                            ไม่มีข้อมูลสายพันธุ์
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {editingStrain ? 'แก้ไขสายพันธุ์' : 'เพิ่มสายพันธุ์ใหม่'}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">ชื่อสายพันธุ์</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">ประเภท</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        >
                                            <option value="Indica">อินดิกา</option>
                                            <option value="Sativa">ซาติวา</option>
                                            <option value="Hybrid">ไฮบริด</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">THC (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            required
                                            value={formData.thcPercent}
                                            onChange={(e) => setFormData({...formData, thcPercent: e.target.value})}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">สต็อก (กรัม)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={formData.stock}
                                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">ราคา (บาท)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">หมายเหตุ</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                            rows="3"
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        {editingStrain ? 'บันทึกการแก้ไข' : 'เพิ่มสายพันธุ์'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}

export default StrainsPage