import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function ProductsEdit({ product, categories, available_sizes, available_colors }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '', slug: product.slug || '', description: product.description || '',
        price: product.price || '', original_price: product.original_price || '', category_id: product.category_id || '',
        badge: product.badge || '', is_featured: product.is_featured ?? false, is_active: product.is_active ?? true,
        sizes: product.size_attributes?.length ? product.size_attributes.map(s => ({ size_id: s.size_id, stock: s.stock })) : [{ size_id: '', stock: '' }],
        colors: product.color_attributes?.length ? product.color_attributes.map(c => ({ color_id: c.color_id })) : [{ color_id: '' }],
        details: product.details?.length ? product.details.map(d => ({ detail: d.detail })) : [{ detail: '' }],
    });

    const handleSubmit = (e) => { e.preventDefault(); put(`/products/${product.id}`); };
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Edit Product">
            <div className="max-w-3xl">
                <div className="mb-6"><Link href="/products" className="text-sm text-primary-500 hover:text-primary-600">← Back to Products</Link></div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label><input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug</label><input type="text" value={data.slug} onChange={e => setData('slug', e.target.value)} className={inputClass} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price</label><input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className={inputClass} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Original Price</label><input type="number" step="0.01" value={data.original_price} onChange={e => setData('original_price', e.target.value)} className={inputClass} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label><select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className={inputClass}><option value="">Select</option>{categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Badge</label><input type="text" value={data.badge} onChange={e => setData('badge', e.target.value)} className={inputClass} /></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label><textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className={inputClass}></textarea></div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2"><input type="checkbox" checked={data.is_featured} onChange={e => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500" /><span className="text-sm text-gray-700 dark:text-gray-300">Featured</span></label>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500" /><span className="text-sm text-gray-700 dark:text-gray-300">Active</span></label>
                        </div>
                    </div>
                    {/* Existing images */}
                    {product.images?.length > 0 && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Images</h3>
                            <div className="flex gap-3 flex-wrap">{product.images.map(img => <img key={img.id} src={`/${img.image_path}`} className="w-20 h-20 object-cover rounded-xl" />)}</div>
                        </div>
                    )}
                    {/* Sizes */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sizes</h3><button type="button" onClick={() => setData('sizes', [...data.sizes, { size_id: '', stock: '' }])} className="text-sm text-primary-500 flex items-center gap-1"><HiOutlinePlus className="w-4 h-4" /> Add</button></div>
                        {data.sizes.map((s, i) => (
                            <div key={i} className="flex gap-3 mb-3">
                                <select value={s.size_id} onChange={e => { const a = [...data.sizes]; a[i].size_id = e.target.value; setData('sizes', a); }} className={inputClass}>
                                    <option value="">Select Size</option>
                                    {available_sizes.map(size => <option key={size.id} value={size.id}>{size.name}</option>)}
                                </select>
                                <input type="number" placeholder="Stock" value={s.stock} onChange={e => { const a = [...data.sizes]; a[i].stock = e.target.value; setData('sizes', a); }} className={inputClass + ' w-28'} />
                                {data.sizes.length > 1 && <button type="button" onClick={() => setData('sizes', data.sizes.filter((_, idx) => idx !== i))} className="p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>}
                            </div>
                        ))}
                    </div>
                    {/* Colors */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Colors</h3><button type="button" onClick={() => setData('colors', [...data.colors, { color_id: '' }])} className="text-sm text-primary-500 flex items-center gap-1"><HiOutlinePlus className="w-4 h-4" /> Add</button></div>
                        {data.colors.map((c, i) => (
                            <div key={i} className="flex gap-3 mb-3">
                                <select value={c.color_id} onChange={e => { const a = [...data.colors]; a[i].color_id = e.target.value; setData('colors', a); }} className={inputClass}>
                                    <option value="">Select Color</option>
                                    {available_colors.map(color => <option key={color.id} value={color.id}>{color.name}</option>)}
                                </select>
                                <div className="w-10 h-10 rounded-lg border border-gray-200" style={{ backgroundColor: available_colors.find(col => col.id == c.color_id)?.code || 'transparent' }}></div>
                                {data.colors.length > 1 && <button type="button" onClick={() => setData('colors', data.colors.filter((_, idx) => idx !== i))} className="p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>}
                            </div>
                        ))}
                    </div>
                    {/* Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details</h3><button type="button" onClick={() => setData('details', [...data.details, { detail: '' }])} className="text-sm text-primary-500 flex items-center gap-1"><HiOutlinePlus className="w-4 h-4" /> Add</button></div>
                        {data.details.map((d, i) => <div key={i} className="flex gap-3 mb-3"><input type="text" placeholder="Detail" value={d.detail} onChange={e => { const a = [...data.details]; a[i].detail = e.target.value; setData('details', a); }} className={inputClass} />{data.details.length > 1 && <button type="button" onClick={() => setData('details', data.details.filter((_, idx) => idx !== i))} className="p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>}</div>)}
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50">{processing ? 'Saving...' : 'Update Product'}</button>
                        <Link href="/products" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
