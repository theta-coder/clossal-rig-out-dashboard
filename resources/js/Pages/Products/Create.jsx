import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function ProductsCreate({ categories, available_sizes, available_colors }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', slug: '', description: '', price: '', original_price: '', category_id: '', badge: '', is_featured: false, is_active: true,
        images: [], sizes: [{ size_id: '', stock: '' }], colors: [{ color_id: '' }], details: [{ detail: '' }],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/products', { forceFormData: true });
    };

    const addSize = () => setData('sizes', [...data.sizes, { size_id: '', stock: '' }]);
    const removeSize = (i) => setData('sizes', data.sizes.filter((_, idx) => idx !== i));
    const addColor = () => setData('colors', [...data.colors, { color_id: '' }]);
    const removeColor = (i) => setData('colors', data.colors.filter((_, idx) => idx !== i));
    const addDetail = () => setData('details', [...data.details, { detail: '' }]);
    const removeDetail = (i) => setData('details', data.details.filter((_, idx) => idx !== i));

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Create Product">
            <div className="max-w-3xl">
                <div className="mb-6">
                    <Link href="/products" className="text-sm text-primary-500 hover:text-primary-600">← Back to Products</Link>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug</label>
                                <input type="text" value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="Auto-generated" className={inputClass + ' placeholder-gray-400'} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price</label>
                                <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className={inputClass} />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Original Price</label>
                                <input type="number" step="0.01" value={data.original_price} onChange={e => setData('original_price', e.target.value)} placeholder="For sale display" className={inputClass + ' placeholder-gray-400'} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className={inputClass}>
                                    <option value="">Select category</option>
                                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Badge</label>
                                <input type="text" value={data.badge} onChange={e => setData('badge', e.target.value)} placeholder="e.g. New, Sale" className={inputClass + ' placeholder-gray-400'} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className={inputClass}></textarea>
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.is_featured} onChange={e => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                            </label>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images</h3>
                        <input type="file" accept="image/*" multiple onChange={e => setData('images', Array.from(e.target.files))} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 dark:file:bg-primary-500/10 dark:file:text-primary-400" />
                    </div>

                    {/* Sizes */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sizes</h3>
                            <button type="button" onClick={addSize} className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"><HiOutlinePlus className="w-4 h-4" /> Add</button>
                        </div>
                        {data.sizes.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 mb-3">
                                <select value={s.size_id} onChange={e => { const sizes = [...data.sizes]; sizes[i].size_id = e.target.value; setData('sizes', sizes); }} className={inputClass}>
                                    <option value="">Select Size</option>
                                    {available_sizes.map(size => <option key={size.id} value={size.id}>{size.name}</option>)}
                                </select>
                                <input type="number" placeholder="Stock" value={s.stock} onChange={e => { const sizes = [...data.sizes]; sizes[i].stock = e.target.value; setData('sizes', sizes); }} className={inputClass + ' w-28'} />
                                {data.sizes.length > 1 && <button type="button" onClick={() => removeSize(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>}
                            </div>
                        ))}
                    </div>

                    {/* Colors */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Colors</h3>
                            <button type="button" onClick={addColor} className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"><HiOutlinePlus className="w-4 h-4" /> Add</button>
                        </div>
                        {data.colors.map((c, i) => (
                            <div key={i} className="flex items-center gap-3 mb-3">
                                <select value={c.color_id} onChange={e => { const colors = [...data.colors]; colors[i].color_id = e.target.value; setData('colors', colors); }} className={inputClass}>
                                    <option value="">Select Color</option>
                                    {available_colors.map(color => <option key={color.id} value={color.id}>{color.name}</option>)}
                                </select>
                                <div className="w-10 h-10 rounded-lg border border-gray-200" style={{ backgroundColor: available_colors.find(col => col.id == c.color_id)?.code || 'transparent' }}></div>
                                {data.colors.length > 1 && <button type="button" onClick={() => removeColor(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>}
                            </div>
                        ))}
                    </div>

                    {/* Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details</h3>
                            <button type="button" onClick={addDetail} className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"><HiOutlinePlus className="w-4 h-4" /> Add</button>
                        </div>
                        {data.details.map((d, i) => (
                            <div key={i} className="flex items-center gap-3 mb-3">
                                <input type="text" placeholder="Product detail" value={d.detail} onChange={e => { const details = [...data.details]; details[i].detail = e.target.value; setData('details', details); }} className={inputClass} />
                                {data.details.length > 1 && <button type="button" onClick={() => removeDetail(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50">
                            {processing ? 'Creating...' : 'Create Product'}
                        </button>
                        <Link href="/products" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
