import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '../../Components/GuestLayout';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import Swal from 'sweetalert2';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        clearErrors();

        post(route('login'), {
            onError: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Authentication Failed',
                    text: Object.values(err)[0] || 'Invalid credentials',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#f43f5e'
                });
            }
        });
    };

    return (
        <GuestLayout title="Sign in to your account">
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-400">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                        Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineMail className="h-5 w-5 text-neutral-500" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={`block w-full pl-10 bg-neutral-900/50 border ${errors.email ? 'border-red-500 ring-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-3 transition ease-in-out duration-200 placeholder-neutral-500`}
                            placeholder="admin@urbanthreads.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                        Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineLockClosed className="h-5 w-5 text-neutral-500" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={`block w-full pl-10 bg-neutral-900/50 border ${errors.password ? 'border-red-500 ring-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-3 transition ease-in-out duration-200 placeholder-neutral-500`}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-700 rounded bg-neutral-900"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-neutral-400">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link
                            href={route('password.request')}
                            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-primary-500/30 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-neutral-900 transform transition-all duration-300 ${processing ? 'opacity-75 cursor-not-allowed scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/40'}`}
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </div>
                        ) : 'Sign in'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-xs text-neutral-500">Admin access only. Contact your administrator to get an account.</p>
            </div>
        </GuestLayout>
    );
}
