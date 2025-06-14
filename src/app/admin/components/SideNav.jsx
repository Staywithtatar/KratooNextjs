"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Custom SVG Icons
const HomeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const CannabisIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1s1-.45 1-1v-1.5c.33.08.66.15 1 .19V18c0 .55.45 1 1 1s1-.45 1-1v-2.31c.34-.04.67-.11 1-.19V17c0 .55.45 1 1 1s1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-1-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm2 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
    </svg>
);

const SalesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const ReportsIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const SettingsIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Strains", href: "/admin/strains", icon: CannabisIcon },
    { name: "Sales", href: "/admin/sales", icon: SalesIcon },
    { name: "Stock Logs", href: "/admin/stock-logs", icon: StockIcon },
    { name: "Reports", href: "/admin/reports", icon: ReportsIcon },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

export default function SideNav({ isOpen, toggleSidebar }) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 shadow-2xl border-r border-gray-700 z-40 transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                
                {/* Header - เพิ่ม padding-top เพื่อให้เว้นระยะจาก navbar */}
                <div className="p-6 pt-24 border-b border-gray-700">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V7l-10-5z"/>
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-white font-semibold text-lg">Admin Panel</h3>
                            <p className="text-gray-400 text-sm">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4 pb-8 overflow-y-auto h-[calc(100vh-240px)]">
                    <div className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={toggleSidebar}
                                    className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25 transform scale-105"
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-102"
                                    }`}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full"></div>
                                    )}
                                    
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 mr-4 ${
                                        isActive ? "text-white" : "text-gray-400 group-hover:text-green-400"
                                    }`}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    
                                    {/* Text */}
                                    <span className="flex-1">{item.name}</span>
                                    
                                    {/* Hover effect */}
                                    {!isActive && (
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10 transition-all duration-300"></div>
                                    )}
                                    
                                    {/* Active glow effect */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-500/20 blur-sm"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Bottom decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
            </div>
        </>
    );
}