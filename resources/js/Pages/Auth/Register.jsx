import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '../../Components/GuestLayout';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';
import Swal from 'sweetalert2';

export default function Register() {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('register'), {
            onError: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration failed',
                    text: Object.values(err)[0] || 'Please check your inputs',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#f43f5e'
                });
            }
        });
    };

    return (
        <GuestLayout title="Create an account" description="Join Urban Threads Admin Dashboard">
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">
                        Full Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineUser className="h-5 w-5 text-neutral-500" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={data.name}
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className={`block w-full pl-10 bg-neutral-900/50 border ${errors.name ? 'border-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-2.5 transition ease-in-out duration-200 placeholder-neutral-500`}
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                        Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineMail className="h-5 w-5 text-neutral-500" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className={`block w-full pl-10 bg-neutral-900/50 border ${errors.email ? 'border-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-2.5 transition ease-in-out duration-200 placeholder-neutral-500`}
                            placeholder="admin@urbanthreads.com"
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-1">
                        Phone Number (optional)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlinePhone className="h-5 w-5 text-neutral-500" />
                        </div>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={data.phone}
                            autoComplete="tel"
                            onChange={(e) => setData('phone', e.target.value)}
                            className={`block w-full pl-10 bg-neutral-900/50 border ${errors.phone ? 'border-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-2.5 transition ease-in-out duration-200 placeholder-neutral-500`}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                            Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiOutlineLockClosed className="h-5 w-5 text-neutral-500" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className={`block w-full pl-10 bg-neutral-900/50 border ${errors.password ? 'border-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-2.5 transition ease-in-out duration-200 placeholder-neutral-500`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-neutral-300 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiOutlineLockClosed className="h-5 w-5 text-neutral-500" />
                            </div>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                className={`block w-full pl-10 bg-neutral-900/50 border ${errors.password_confirmation ? 'border-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-2.5 transition ease-in-out duration-200 placeholder-neutral-500`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-primary-500/30 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-neutral-900 transform transition-all duration-300 ${processing ? 'opacity-75 cursor-not-allowed scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/40'}`}
                    >
                        {processing ? 'Registering...' : 'Sign up'}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-neutral-400">
                    Already have an account?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
