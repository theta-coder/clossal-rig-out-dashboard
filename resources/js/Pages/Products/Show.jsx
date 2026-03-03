import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlineStar } from 'react-icons/hi';

export default function ProductsShow({ product }) {
    return (
        <DashboardLayout title="Product Details">
            <div className="max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/products" className="text-sm text-primary-500 hover:text-primary-600">← Back to Products</Link>
                    <Link href={`/products/${product.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-all">
                        <HiOutlinePencil className="w-4 h-4" /> Edit Product
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Images */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                        {product.images?.length > 0 ? (
                            <div className="space-y-3">
                                <img src={`/${product.images[0].image_path}`} className="w-full rounded-xl object-cover aspect-square" />
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.slice(1).map(img => <img key={img.id} src={`/${img.image_path}`} className="w-full rounded-lg object-cover aspect-square" />)}
                                </div>
                            </div>
                        ) : <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">No images</div>}
                    </div>
                    {/* Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
                                </div>
                                {product.badge && <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">{product.badge}</span>}
                            </div>
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">${Number(product.price).toFixed(2)}</span>
                                {product.original_price && <span className="text-lg text-gray-400 line-through">${Number(product.original_price).toFixed(2)}</span>}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{product.description || 'No description'}</p>
                            <div className="flex gap-4 mt-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>{product.is_active ? 'Active' : 'Inactive'}</span>
                                {product.is_featured && <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">Featured</span>}
                            </div>
                        </div>
                        {/* Sizes */}
                        {product.sizes?.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Sizes & Stock</h3>
                                <div className="flex flex-wrap gap-2">{product.sizes.map(s => <div key={s.id} className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm"><span className="font-medium text-gray-900 dark:text-white">{s.size}</span><span className="text-gray-400 ml-2">({s.stock} in stock)</span></div>)}</div>
                            </div>
                        )}
                        {/* Colors */}
                        {product.colors?.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Colors</h3>
                                <div className="flex flex-wrap gap-3">{product.colors.map(c => <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800"><div className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600" style={{ backgroundColor: c.color_code }}></div><span className="text-sm text-gray-700 dark:text-gray-300">{c.color_name}</span></div>)}</div>
                            </div>
                        )}
                        {/* Reviews */}
                        {product.reviews?.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Reviews ({product.reviews.length})</h3>
                                <div className="space-y-4">{product.reviews.map(r => (
                                    <div key={r.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900 dark:text-white text-sm">{r.user?.name || r.reviewer_name}</span>
                                            <div className="flex items-center gap-0.5">{[...Array(5)].map((_, i) => <HiOutlineStar key={i} className={`w-4 h-4 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />)}</div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{r.body}</p>
                                    </div>
                                ))}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
