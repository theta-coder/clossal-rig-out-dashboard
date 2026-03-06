import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlineUpload } from 'react-icons/hi';
import { Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        status: 'draft',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/dashboard/blog');
    };

    return (
        <DashboardLayout title="Create New Post">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/dashboard/blog" className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-2">
                        <HiOutlineArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Article</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Post Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-900 dark:text-white uppercase font-bold"
                                    placeholder="Enter title here..."
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Article Content</label>
                                <textarea
                                    rows="12"
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-600 dark:text-slate-400 leading-relaxed"
                                    placeholder="Write your content here..."
                                />
                                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Publication</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Status</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                            >
                                <HiOutlineSave className="w-5 h-5" />
                                Save Post
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Featured Image</h3>
                        <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer p-4 group">
                            <HiOutlineUpload className="w-8 h-8 text-slate-300 dark:text-slate-700 group-hover:text-primary-500 transition-colors" />
                            <p className="text-xs font-medium text-slate-400 text-center">Click to upload or drag and drop</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
