import React from 'react';
import { useTheme } from '../Contexts/ThemeContext';
import { HiOutlineSun, HiOutlineMoon, HiOutlineDesktopComputer } from 'react-icons/hi';

const modes = [
    { value: 'light', icon: HiOutlineSun, label: 'Light' },
    { value: 'dark', icon: HiOutlineMoon, label: 'Dark' },
    { value: 'system', icon: HiOutlineDesktopComputer, label: 'System' },
];

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
            {modes.map((mode) => (
                <button
                    key={mode.value}
                    onClick={() => setTheme(mode.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                        ${theme === mode.value
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }
                    `}
                    title={mode.label}
                >
                    <mode.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{mode.label}</span>
                </button>
            ))}
        </div>
    );
}
