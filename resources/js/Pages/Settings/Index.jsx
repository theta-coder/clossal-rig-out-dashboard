import React from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlineCog } from 'react-icons/hi';

const defaultKeys = [
    { key: 'site_name', label: 'Site Name', type: 'text' },
    { key: 'site_description', label: 'Site Description', type: 'textarea' },
    { key: 'contact_email', label: 'Contact Email', type: 'email' },
    { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
    { key: 'address', label: 'Business Address', type: 'textarea' },
    { key: 'shipping_cost', label: 'Default Shipping Cost', type: 'number' },
    { key: 'free_shipping_threshold', label: 'Free Shipping Threshold', type: 'number' },
    { key: 'currency', label: 'Currency', type: 'text' },
    { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
    { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
    { key: 'twitter_url', label: 'Twitter URL', type: 'url' },
];

export default function SettingsIndex({ settings }) {
    const settingsMap = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });

    const { data, setData, put, processing } = useForm({
        settings: defaultKeys.map(k => ({
            key: k.key,
            value: settingsMap[k.key] || '',
        })),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/settings');
    };

    const updateSetting = (index, value) => {
        const updated = [...data.settings];
        updated[index].value = value;
        setData('settings', updated);
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Settings">
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {/* General */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-500/10"><HiOutlineCog className="w-5 h-5 text-primary-600 dark:text-primary-400" /></div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
                    </div>
                    <div className="space-y-5">
                        {defaultKeys.map((k, i) => (
                            <div key={k.key}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{k.label}</label>
                                {k.type === 'textarea' ? (
                                    <textarea
                                        value={data.settings[i]?.value || ''}
                                        onChange={e => updateSetting(i, e.target.value)}
                                        rows={3}
                                        className={inputClass}
                                    />
                                ) : (
                                    <input
                                        type={k.type}
                                        value={data.settings[i]?.value || ''}
                                        onChange={e => updateSetting(i, e.target.value)}
                                        className={inputClass}
                                        step={k.type === 'number' ? '0.01' : undefined}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50">
                    {processing ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </DashboardLayout>
    );
}
