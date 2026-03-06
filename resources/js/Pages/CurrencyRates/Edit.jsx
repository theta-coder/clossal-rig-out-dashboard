import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

const toDateTimeInput = (value) => {
    if (!value) return '';
    return String(value).replace(' ', 'T').slice(0, 16);
};

export default function CurrencyRatesEdit({ currencyRate }) {
    const { data, setData, put, processing, errors } = useForm({
        base_currency: currencyRate?.base_currency ?? '',
        target_currency: currencyRate?.target_currency ?? '',
        rate: currencyRate?.rate ?? '',
        source: currencyRate?.source ?? '',
        last_updated_at: toDateTimeInput(currencyRate?.last_updated_at),
    });

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/currency-rates/${currencyRate.id}`);
    };

    return (
        <DashboardLayout title="Edit Currency Rate">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/currency-rates" className="text-sm text-primary-500 hover:text-primary-600">
                        Back to Currency Rates
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Base Currency</label>
                            <input
                                type="text"
                                value={data.base_currency}
                                onChange={(e) => setData('base_currency', e.target.value.toUpperCase())}
                                maxLength={3}
                                className={inputClass}
                            />
                            {errors.base_currency && <p className="text-red-500 text-xs mt-1">{errors.base_currency}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Currency</label>
                            <input
                                type="text"
                                value={data.target_currency}
                                onChange={(e) => setData('target_currency', e.target.value.toUpperCase())}
                                maxLength={3}
                                className={inputClass}
                            />
                            {errors.target_currency && <p className="text-red-500 text-xs mt-1">{errors.target_currency}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rate</label>
                        <input
                            type="number"
                            min="0"
                            step="0.000001"
                            value={data.rate}
                            onChange={(e) => setData('rate', e.target.value)}
                            className={inputClass}
                        />
                        {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Source <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="text"
                            value={data.source}
                            onChange={(e) => setData('source', e.target.value)}
                            className={inputClass}
                        />
                        {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Updated At <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="datetime-local"
                            value={data.last_updated_at}
                            onChange={(e) => setData('last_updated_at', e.target.value)}
                            className={inputClass}
                        />
                        {errors.last_updated_at && <p className="text-red-500 text-xs mt-1">{errors.last_updated_at}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Updating...' : 'Update Rate'}
                        </button>
                        <Link href="/currency-rates" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

