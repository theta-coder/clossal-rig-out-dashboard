import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function CourierCompaniesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        logo: '',
        tracking_url_format: '',
        api_key: '',
        api_secret: '',
        api_url: '',
        contact_number: '',
        contact_email: '',
        default_rate: '0',
        is_active: true,
    });

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/courier-companies');
    };

    return (
        <DashboardLayout title="Create Courier Company">
            <div className="max-w-3xl">
                <div className="mb-6">
                    <Link href="/courier-companies" className="text-sm text-primary-500 hover:text-primary-600">
                        Back to Courier Companies
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="TCS"
                                className={inputClass}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug <span className="text-gray-400 font-normal">(optional)</span></label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="tcs"
                                className={inputClass}
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Number</label>
                            <input
                                type="text"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                placeholder="+92-300-0000000"
                                className={inputClass}
                            />
                            {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Email</label>
                            <input
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                placeholder="support@courier.com"
                                className={inputClass}
                            />
                            {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Default Rate</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.default_rate}
                                onChange={(e) => setData('default_rate', e.target.value)}
                                className={inputClass}
                            />
                            {errors.default_rate && <p className="text-red-500 text-xs mt-1">{errors.default_rate}</p>}
                        </div>
                        <div className="flex items-end pb-2">
                            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_active)}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                                Active Company
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Logo URL</label>
                        <input
                            type="text"
                            value={data.logo}
                            onChange={(e) => setData('logo', e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className={inputClass}
                        />
                        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tracking URL Format</label>
                        <input
                            type="text"
                            value={data.tracking_url_format}
                            onChange={(e) => setData('tracking_url_format', e.target.value)}
                            placeholder="https://courier.com/track/{tracking_number}"
                            className={inputClass}
                        />
                        {errors.tracking_url_format && <p className="text-red-500 text-xs mt-1">{errors.tracking_url_format}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">API URL</label>
                            <input
                                type="text"
                                value={data.api_url}
                                onChange={(e) => setData('api_url', e.target.value)}
                                placeholder="https://api.courier.com/v1"
                                className={inputClass}
                            />
                            {errors.api_url && <p className="text-red-500 text-xs mt-1">{errors.api_url}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">API Key</label>
                            <input
                                type="text"
                                value={data.api_key}
                                onChange={(e) => setData('api_key', e.target.value)}
                                className={inputClass}
                            />
                            {errors.api_key && <p className="text-red-500 text-xs mt-1">{errors.api_key}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">API Secret</label>
                        <input
                            type="text"
                            value={data.api_secret}
                            onChange={(e) => setData('api_secret', e.target.value)}
                            className={inputClass}
                        />
                        {errors.api_secret && <p className="text-red-500 text-xs mt-1">{errors.api_secret}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Creating...' : 'Create Company'}
                        </button>
                        <Link href="/courier-companies" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

