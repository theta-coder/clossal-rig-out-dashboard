import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineUpload, HiOutlineArrowLeft, HiOutlineSave } from 'react-icons/hi';

const cleanOptionalRows = (formData) => ({
    ...formData,
    sizes: formData.sizes.filter((size) => size.size_id && size.stock !== ''),
    colors: formData.colors.filter((color) => color.color_id),
    details: formData.details.filter((detail) => detail.detail && detail.detail.trim() !== ''),
    tags: (formData.tags || []).filter(Boolean),
    collections: (formData.collections || []).filter(Boolean),
});

export default function ProductsEdit({ product, categories, available_sizes, available_colors, available_tags, available_collections }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'PUT',
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        category_id: product.category_id || '',
        badge: product.badge || '',
        is_featured: product.is_featured ?? false,
        is_active: product.is_active ?? true,
        images: [],
        sizes: product.size_attributes?.map((size) => ({ size_id: size.size_id, stock: size.stock })) || [],
        colors: product.color_attributes?.map((color) => ({ color_id: color.color_id })) || [],
        tags: product.tags?.map((tag) => tag.id) || [],
        collections: product.collections?.map((collection) => collection.id) || [],
        details: product.details?.map((detail) => ({ detail: detail.detail })) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((current) => cleanOptionalRows(current));
        post(route('products.update', product.id));
    };

    const addSize = () => setData('sizes', [...data.sizes, { size_id: '', stock: '' }]);
    const removeSize = (index) => setData('sizes', data.sizes.filter((_, i) => i !== index));

    const addColor = () => setData('colors', [...data.colors, { color_id: '' }]);
    const removeColor = (index) => setData('colors', data.colors.filter((_, i) => i !== index));

    const addDetail = () => setData('details', [...data.details, { detail: '' }]);
    const removeDetail = (index) => setData('details', data.details.filter((_, i) => i !== index));

    const toggleMultiSelect = (field, id) => {
        setData(field, data[field].includes(id)
            ? data[field].filter((item) => item !== id)
            : [...data[field], id]);
    };

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

    return (
        <DashboardLayout title="Edit Product">
            <Head title={`Edit - ${product.name}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/products" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium transition-colors">
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back to Products
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-600">
                                <HiOutlinePlus className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">General Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug</label>
                                <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputClass} />
                                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                                <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className={inputClass}>
                                    <option value="">Select category</option>
                                    {categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Regular Price ($)</label>
                                <input type="number" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className={inputClass} />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Original Price ($)</label>
                                <input type="number" step="0.01" value={data.original_price} onChange={(e) => setData('original_price', e.target.value)} className={inputClass} />
                                {errors.original_price && <p className="text-red-500 text-xs mt-1">{errors.original_price}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} className={inputClass}></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Product Media</h3>

                        {product.images?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Currently Active</p>
                                <div className="flex gap-3 flex-wrap">
                                    {product.images.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img src={`/${image.image_path}`} className="w-24 h-24 object-cover rounded-xl border border-gray-100 dark:border-gray-800" alt={product.name} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="relative group">
                            <div className="w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <HiOutlineUpload className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                <span className="text-sm font-medium text-gray-500">Upload New Images (Overwrites existing)</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setData('images', Array.from(e.target.files || []))}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        {data.images.length > 0 && (
                            <p className="text-xs text-emerald-600 font-bold">{data.images.length} new images selected</p>
                        )}
                        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                    </div>

                    {/* Variations & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sizes */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-md font-bold text-gray-900 dark:text-white">Sizes</h3>
                                <button type="button" onClick={addSize} className="p-1 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"><HiOutlinePlus className="w-5 h-5" /></button>
                            </div>
                            {data.sizes.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No sizes added.</p>}
                            <div className="space-y-3">
                                {data.sizes.map((size, index) => (
                                    <div key={index} className="flex gap-2">
                                        <select
                                            value={size.size_id}
                                            onChange={(e) => {
                                                const next = [...data.sizes];
                                                next[index].size_id = e.target.value;
                                                setData('sizes', next);
                                            }}
                                            className={`${inputClass} h-10 py-0 text-sm`}
                                        >
                                            <option value="">Size</option>
                                            {available_sizes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={size.stock}
                                            onChange={(e) => {
                                                const next = [...data.sizes];
                                                next[index].stock = e.target.value;
                                                setData('sizes', next);
                                            }}
                                            className={`${inputClass} h-10 py-0 text-sm w-20`}
                                        />
                                        <button type="button" onClick={() => removeSize(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-md font-bold text-gray-900 dark:text-white">Colors</h3>
                                <button type="button" onClick={addColor} className="p-1 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"><HiOutlinePlus className="w-5 h-5" /></button>
                            </div>
                            {data.colors.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No colors added.</p>}
                            <div className="space-y-3">
                                {data.colors.map((color, index) => (
                                    <div key={index} className="flex gap-2">
                                        <select
                                            value={color.color_id}
                                            onChange={(e) => {
                                                const next = [...data.colors];
                                                next[index].color_id = e.target.value;
                                                setData('colors', next);
                                            }}
                                            className={`${inputClass} h-10 py-0 text-sm`}
                                        >
                                            <option value="">Color</option>
                                            {available_colors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <button type="button" onClick={() => removeColor(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Status & Options */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Visibility</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</span>
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Item</span>
                                <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Badge</label>
                            <input type="text" value={data.badge} onChange={(e) => setData('badge', e.target.value)} placeholder="e.g. New Arrival" className={inputClass} />
                            {errors.badge && <p className="text-red-500 text-xs mt-1">{errors.badge}</p>}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tags & Collections</h3>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tags</p>
                            {available_tags?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {available_tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => toggleMultiSelect('tags', tag.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${data.tags.includes(tag.id)
                                                ? 'bg-primary-500 text-white border-primary-500'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No tags available.</p>
                            )}
                            {errors.tags && <p className="text-red-500 text-xs mt-2">{errors.tags}</p>}
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Collections</p>
                            {available_collections?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {available_collections.map((collection) => (
                                        <button
                                            key={collection.id}
                                            type="button"
                                            onClick={() => toggleMultiSelect('collections', collection.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${data.collections.includes(collection.id)
                                                ? 'bg-primary-500 text-white border-primary-500'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            {collection.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No active collections available.</p>
                            )}
                            {errors.collections && <p className="text-red-500 text-xs mt-2">{errors.collections}</p>}
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Details</h3>
                            <button type="button" onClick={addDetail} className="p-1 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"><HiOutlinePlus className="w-5 h-5" /></button>
                        </div>
                        {data.details.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No details added.</p>}
                        <div className="space-y-2">
                            {data.details.map((detail, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={detail.detail}
                                        onChange={(e) => {
                                            const next = [...data.details];
                                            next[index].detail = e.target.value;
                                            setData('details', next);
                                        }}
                                        className={`${inputClass} h-9 text-xs`}
                                        placeholder="Feature..."
                                    />
                                    <button type="button" onClick={() => removeDetail(index)} className="p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-[0px]"
                    >
                        <HiOutlineSave className="w-6 h-6" /> {processing ? 'Updating...' : 'Save All Changes'}
                    </button>

                    <Link
                        href="/products"
                        className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </DashboardLayout>
    );
}

