import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlinePlus, HiOutlineUpload } from 'react-icons/hi';

export default function CollectionsCreate({ products }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        image: null,
        starts_at: '',
        ends_at: '',
        is_active: true,
        sort_order: 0,
        product_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('collections.store'));
    };

    const handleProductToggle = (productId) => {
        const currentIds = [...data.product_ids];
        if (currentIds.includes(productId)) {
            setData('product_ids', currentIds.filter((id) => id !== productId));
        } else {
            setData('product_ids', [...currentIds, productId]);
        }
    };

    return (
        <DashboardLayout title="Create Collection">
            <Head title="New Collection" />

            <div className="mb-6 flex items-center justify-between">
                <Link href={route('collections.index')} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium">
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back to List
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">General Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collection Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="e.g. Eid Collection 2026"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (Optional)</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="auto-generated if empty"
                                />
                                {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Tell the story behind this collection..."
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Products</h2>
                        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductToggle(product.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${data.product_ids.includes(product.id) ? 'bg-primary-50 border-primary-200 dark:bg-primary-500/10 dark:border-primary-500/30' : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${data.product_ids.includes(product.id) ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {data.product_ids.includes(product.id) && <HiOutlineSave className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={`text-sm font-medium ${data.product_ids.includes(product.id) ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {product.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {errors.product_ids && <p className="mt-2 text-xs text-red-500">{errors.product_ids}</p>}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Banner Image</h2>
                        <div className="relative group">
                            <div className="aspect-video rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden">
                                {data.image ? (
                                    <img src={URL.createObjectURL(data.image)} className="w-full h-full object-cover" alt="Collection preview" />
                                ) : (
                                    <HiOutlineUpload className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">Click to upload collection image</p>
                        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Status & Settings</h2>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</span>
                            <button
                                type="button"
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_active ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                            />
                            {errors.sort_order && <p className="mt-1 text-xs text-red-500">{errors.sort_order}</p>}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Timeline</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starts At</label>
                            <input
                                type="date"
                                value={data.starts_at}
                                onChange={(e) => setData('starts_at', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                            />
                            {errors.starts_at && <p className="mt-1 text-xs text-red-500">{errors.starts_at}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ends At (Optional)</label>
                            <input
                                type="date"
                                value={data.ends_at}
                                onChange={(e) => setData('ends_at', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                            />
                            {errors.ends_at && <p className="mt-1 text-xs text-red-500">{errors.ends_at}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <HiOutlinePlus className="w-5 h-5" /> {processing ? 'Creating...' : 'Create Collection'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}

