import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

export default function DashboardLayout({ children, title }) {
    const [collapsed, setCollapsed] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { flash, errors, auth } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: flash.success,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
        if (flash?.error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: flash.error,
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
            });
        }

        // Check for validation errors and show a generic error toast if they exist
        if (errors && Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).join('<br>');
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Validation Error',
                html: errorMessages,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        }
    }, [flash, errors]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Head title={title} />

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main content */}
            <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[70px]' : 'lg:ml-64'}`}>
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Left - Page title */}
                        <div className="flex items-center gap-4 ml-12 lg:ml-0">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
                        </div>

                        {/* Right - Search, Theme, Notifications */}
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
                                <HiOutlineSearch className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 w-48"
                                />
                            </div>

                            <ThemeToggle />

                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                <HiOutlineBell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <div
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-primary-500/25 transition-shadow select-none"
                                >
                                    <span className="text-white text-sm font-semibold uppercase">{auth?.user?.name ? auth.user.name.charAt(0) : 'A'}</span>
                                </div>

                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-20 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{auth?.user?.name || 'Admin User'}</p>
                                                    <span className="text-[9px] font-black uppercase tracking-widest bg-primary-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                                                        {auth?.user?.role || 'admin'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth?.user?.email || 'admin@example.com'}</p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    router.post(route('logout'));
                                                }}
                                                className="w-full text-left block px-4 py-2 mt-1 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors font-medium border-none outline-none"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
