import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function CategoriesEdit({ category, parentCategories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '', slug: category.slug || '', image: null, parent_id: category.parent_id || '', is_active: category.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    return (
        <DashboardLayout title="Edit Category">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/categories" className="text-sm text-primary-500 hover:text-primary-600">← Back to Categories</Link>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug</label>
                        <input type="text" value={data.slug} onChange={e => setData('slug', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Parent Category</label>
                        <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                            <option value="">None</option>
                            {parentCategories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image</label>
                        {category.image && <img src={`/${category.image}`} alt="" className="w-20 h-20 object-cover rounded-lg mb-2" />}
                        <input type="file" accept="image/*" onChange={e => setData('image', e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 dark:file:bg-primary-500/10 dark:file:text-primary-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                        <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50">
                            {processing ? 'Saving...' : 'Update Category'}
                        </button>
                        <Link href="/categories" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
