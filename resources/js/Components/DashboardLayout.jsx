import { useState, useEffect } from 'react';
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

    const initials = auth?.user?.name
        ? auth.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'A';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Head title={title} />

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* ── Main content ───────────────────────── */}
            <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[70px]' : 'lg:ml-64'}`}>

                {/* ── Header ─────────────────────────── */}
                <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

                        {/* Left — page title + date */}
                        <div className="flex items-center gap-3 ml-12 lg:ml-0">
                            <div>
                                <h1 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">{title}</h1>
                                <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Right — actions */}
                        <div className="flex items-center gap-2">

                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus-within:border-primary-300 dark:focus-within:border-primary-700 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
                                <HiOutlineSearch className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 w-40"
                                />
                                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700 rounded-md">
                                    ⌘K
                                </kbd>
                            </div>

                            {/* Theme toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                <HiOutlineBell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                            </button>

                            {/* Divider */}
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm shadow-primary-500/25">
                                        <span className="text-white text-xs font-bold">{initials}</span>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                                            {auth?.user?.name || 'Admin'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 capitalize">
                                            {auth?.user?.role || auth?.roles?.[0] || 'admin'}
                                        </p>
                                    </div>
                                </button>

                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 border border-slate-100 dark:border-slate-800 py-1 z-20 origin-top-right">
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                        {auth?.user?.name || 'Admin User'}
                                                    </p>
                                                    <span className="text-[9px] font-black uppercase tracking-widest bg-primary-500/10 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                                        {auth?.user?.role || 'admin'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                                    {auth?.user?.email || 'admin@example.com'}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    router.post(route('logout'));
                                                }}
                                                className="w-full text-left px-4 py-2.5 mt-1 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
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

                {/* ── Page content ───────────────────── */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
