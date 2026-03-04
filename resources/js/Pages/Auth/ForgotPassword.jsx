import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '../../Components/GuestLayout';
import { HiOutlineMail } from 'react-icons/hi';
import Swal from 'sweetalert2';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('password.email'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Email Sent',
                    text: 'We have emailed your password reset link!',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#10b981' // emerald-500
                });
            },
            onError: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: Object.values(err)[0] || 'Unable to process your request',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#f43f5e'
                });
            }
        });
    };

    return (
        <GuestLayout title="Forgot Password" description="Enter your email to reset your password">
            <Head title="Forgot Password" />

            {status && <div className="mb-4 font-medium text-sm text-green-400">{status}</div>}

            <p className="mb-6 text-sm text-neutral-400 text-center">
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            </p>

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
                            className={`block w-full pl-10 bg-neutral-900/50 border ${errors.email ? 'border-red-500' : 'border-neutral-700 focus:ring-primary-500 focus:border-primary-500'} text-white rounded-lg sm:text-sm py-3 transition ease-in-out duration-200 placeholder-neutral-500`}
                            placeholder="admin@urbanthreads.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-primary-500/30 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-neutral-900 transform transition-all duration-300 ${processing ? 'opacity-75 cursor-not-allowed scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/40'}`}
                    >
                        {processing ? 'Sending...' : 'Email Password Reset Link'}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-neutral-400">
                    Remember your password?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        Sign in instead
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
