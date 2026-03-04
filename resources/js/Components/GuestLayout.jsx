import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, description }) {
    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
            {/* Background design elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/20 transform group-hover:scale-105 transition-all duration-300">
                            <span className="text-white font-bold text-2xl tracking-tighter">UT</span>
                        </div>
                        <span className="text-3xl font-extrabold text-white tracking-tight">
                            Urban Threads
                        </span>
                    </Link>
                    {title && <h2 className="mt-8 text-3xl font-extrabold text-white tracking-tight">{title}</h2>}
                    {description && <p className="mt-2 text-sm text-neutral-400">{description}</p>}
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 py-8 px-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] sm:rounded-2xl sm:px-10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
                    {children}
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-neutral-500 relative z-10">
                &copy; {new Date().getFullYear()} Urban Threads Admin Dashboard.
            </div>
        </div>
    );
}
