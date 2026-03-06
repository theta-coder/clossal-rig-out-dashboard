import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    HiOutlineQuestionMarkCircle, HiOutlinePlus, HiOutlineChevronDown,
    HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineFolder,
} from 'react-icons/hi';

export default function Index({ categories = [] }) {
    const [openCategory, setOpenCategory] = useState(categories[0]?.id);
    const [showFaqForm, setShowFaqForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);

    const faqForm = useForm({ faq_category_id: '', question: '', answer: '' });
    const categoryForm = useForm({ name: '' });

    const openEditFaq = (faq, categoryId) => {
        setEditingFaq(faq);
        faqForm.setData({ faq_category_id: categoryId, question: faq.question, answer: faq.answer });
        setShowFaqForm(true);
    };

    const closeFaqForm = () => { setShowFaqForm(false); setEditingFaq(null); faqForm.reset(); };
    const closeCategoryForm = () => { setShowCategoryForm(false); categoryForm.reset(); };

    const submitFaq = (e) => {
        e.preventDefault();
        if (editingFaq) {
            faqForm.put(route('dashboard.faqs.item.update', editingFaq.id), { onSuccess: closeFaqForm });
        } else {
            faqForm.post(route('dashboard.faqs.item.store'), { onSuccess: closeFaqForm });
        }
    };

    const submitCategory = (e) => {
        e.preventDefault();
        categoryForm.post(route('dashboard.faqs.category.store'), { onSuccess: closeCategoryForm });
    };

    const destroyFaq = (id) => {
        if (confirm('Delete this FAQ?')) router.delete(route('dashboard.faqs.item.destroy', id));
    };

    return (
        <DashboardLayout title="FAQs Management">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Questions & Answers</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage frequently asked questions by category</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowCategoryForm(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <HiOutlineFolder className="w-4 h-4" /> New Category
                    </button>
                    <button onClick={() => setShowFaqForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold shadow-md shadow-primary-500/20">
                        <HiOutlinePlus className="w-5 h-5" /> New FAQ
                    </button>
                </div>
            </div>

            {showCategoryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">New Category</h3>
                            <button onClick={closeCategoryForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submitCategory} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category Name</label>
                                <input value={categoryForm.data.name} onChange={e => categoryForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="Shipping & Delivery" />
                                {categoryForm.errors.name && <p className="text-red-500 text-xs mt-1">{categoryForm.errors.name}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeCategoryForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={categoryForm.processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showFaqForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editingFaq ? 'Edit FAQ' : 'New FAQ'}</h3>
                            <button onClick={closeFaqForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submitFaq} className="space-y-4">
                            {!editingFaq && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                                    <select value={faqForm.data.faq_category_id} onChange={e => faqForm.setData('faq_category_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="">Select category...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {faqForm.errors.faq_category_id && <p className="text-red-500 text-xs mt-1">{faqForm.errors.faq_category_id}</p>}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Question</label>
                                <input value={faqForm.data.question} onChange={e => faqForm.setData('question', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="How long does delivery take?" />
                                {faqForm.errors.question && <p className="text-red-500 text-xs mt-1">{faqForm.errors.question}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Answer</label>
                                <textarea rows={4} value={faqForm.data.answer} onChange={e => faqForm.setData('answer', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none"
                                    placeholder="Delivery typically takes 3-5 business days..." />
                                {faqForm.errors.answer && <p className="text-red-500 text-xs mt-1">{faqForm.errors.answer}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeFaqForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={faqForm.processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {editingFaq ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {categories.length === 0 && (
                    <div className="py-16 text-center text-slate-400">No FAQ categories yet. Create one first.</div>
                )}
                {categories.map((category) => (
                    <div key={category.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <button
                            onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600">
                                    <HiOutlineQuestionMarkCircle className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white uppercase">{category.name}</h3>
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{category.faqs?.length ?? 0}</span>
                            </div>
                            <HiOutlineChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} />
                        </button>

                        {openCategory === category.id && (
                            <div className="p-5 pt-0 divide-y divide-slate-100 dark:divide-slate-800">
                                {category.faqs?.map((faq) => (
                                    <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900 dark:text-white mb-2 uppercase">{faq.question}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button onClick={() => openEditFaq(faq, category.id)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-colors">
                                                    <HiOutlinePencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => destroyFaq(faq.id)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors">
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!category.faqs || category.faqs.length === 0) && (
                                    <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">No questions in this category yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
