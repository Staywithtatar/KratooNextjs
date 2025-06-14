"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation' 

// Custom SVG Icons
const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

const SalesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CannabisIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1s1-.45 1-1v-1.5c.33.08.66.15 1 .19V18c0 .55.45 1 1 1s1-.45 1-1v-2.31c.34-.04.67-.11 1-.19V17c0 .55.45 1 1 1s1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
);

const OrdersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const TrendingUpIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const ChartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for cannabis shop
    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 125670,
        totalOrders: 342,
        totalStrains: 28,
        monthlyGrowth: 15.3
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (session?.user?.role !== 'admin') {
            router.push('/welcome');
        }
    }, [session, status, router]);

    useEffect(() => {
        async function fetchData() {
            try {
                const usersRes = await fetch("/api/totalusers");
                if (!usersRes.ok) {
                    throw new Error(`HTTP error! status: ${usersRes.status}`);
                }
                const usersData = await usersRes.json();
                setTotalUsers(usersData.totalUsers);

                const postsRes = await fetch("/api/totalposts");
                if (!postsRes.ok) {
                    throw new Error(`HTTP error! status: ${postsRes.status}`);
                }
                const postsData = await postsRes.json();
                setTotalPosts(postsData.totalPosts);

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        if (session?.user?.role === 'admin') {
            fetchData();
        }
    }, [session]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-center">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
                    <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    const statsCards = [
        {
            title: "Total Revenue",
            value: `฿${dashboardData.totalRevenue.toLocaleString()}`,
            icon: SalesIcon,
            gradient: "from-emerald-500 to-green-600",
            shadowColor: "shadow-emerald-500/25",
            change: "+12.5%",
            changeType: "positive"
        },
        {
            title: "Total Orders",
            value: dashboardData.totalOrders,
            icon: OrdersIcon,
            gradient: "from-blue-500 to-cyan-600",
            shadowColor: "shadow-blue-500/25",
            change: "+8.2%",
            changeType: "positive"
        },
        {
            title: "Active Strains",
            value: dashboardData.totalStrains,
            icon: CannabisIcon,
            gradient: "from-purple-500 to-pink-600",
            shadowColor: "shadow-purple-500/25",
            change: "+3 new",
            changeType: "neutral"
        },
        {
            title: "Total Customers",
            value: totalUsers,
            icon: UsersIcon,
            gradient: "from-orange-500 to-red-600",
            shadowColor: "shadow-orange-500/25",
            change: "+15.3%",
            changeType: "positive"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                            <CannabisIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Cannabis Shop Dashboard
                            </h1>
                            <p className="text-gray-600 text-lg">Welcome back, {session?.user?.name || session?.user?.email}</p>
                        </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full"></div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card, index) => (
                        <div key={index} className={`bg-white rounded-2xl shadow-lg ${card.shadowColor} p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`bg-gradient-to-r ${card.gradient} p-3 rounded-xl shadow-lg`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                    card.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {card.change}
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Welcome Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                                <TrendingUpIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 ml-3">Business Overview</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">
                                Your cannabis dispensary is performing exceptionally well this month! Revenue has increased by 12.5% 
                                compared to last month, with a significant boost in customer satisfaction and repeat orders.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                    <h4 className="font-semibold text-green-800 mb-2">Top Performing Category</h4>
                                    <p className="text-green-700">Premium Indica Strains</p>
                                    <p className="text-sm text-green-600">65% of total sales</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-2">Customer Satisfaction</h4>
                                    <p className="text-blue-700">4.8/5 Rating</p>
                                    <p className="text-sm text-blue-600">Based on 156 reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                                <ChartIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 ml-3">Quick Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300">
                                Add New Strain
                            </button>
                            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300">
                                View Sales Report
                            </button>
                            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300">
                                Manage Inventory
                            </button>
                            <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:scale-105 transition-all duration-300">
                                Customer Support
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                            <OrdersIcon className="w-6 h-6 text-white" />
                        </div>
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[
                            { action: "New order received", details: "Purple Haze - 3.5g", time: "5 minutes ago", type: "order" },
                            { action: "Stock updated", details: "OG Kush restocked", time: "12 minutes ago", type: "stock" },
                            { action: "Customer review", details: "5-star review for Sour Diesel", time: "25 minutes ago", type: "review" },
                            { action: "New customer registered", details: "John Doe joined", time: "1 hour ago", type: "customer" }
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                <div className={`p-2 rounded-lg mr-4 ${
                                    activity.type === 'order' ? 'bg-green-100 text-green-600' :
                                    activity.type === 'stock' ? 'bg-blue-100 text-blue-600' :
                                    activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-purple-100 text-purple-600'
                                }`}>
                                    <div className="w-2 h-2 rounded-full bg-current"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{activity.action}</p>
                                    <p className="text-gray-600 text-sm">{activity.details}</p>
                                </div>
                                <span className="text-gray-400 text-sm">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;