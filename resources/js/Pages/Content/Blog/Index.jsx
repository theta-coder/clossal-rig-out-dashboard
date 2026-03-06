import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { Link } from '@inertiajs/react';

export default function Index({ posts }) {
    return (
        <DashboardLayout title="Blog Management">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blog Posts</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage articles and company news</p>
                </div>
                <Link
                    href="/dashboard/blog/create"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold shadow-md shadow-primary-500/20"
                >
                    <HiOutlinePlus className="w-5 h-5" />
                    New Post
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.data.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            {post.image ? (
                                <img src={`/storage/${post.image}`} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <HiOutlineDocumentText className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                    }`}>
                                    {post.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-2 group-hover:text-primary-600 transition-colors uppercase">{post.title}</h3>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(post.created_at).toLocaleDateString()}</span>
                                <div className="flex items-center gap-2">
                                    <Link href={`/dashboard/blog/${post.id}/edit`} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-colors">
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </Link>
                                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors">
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
