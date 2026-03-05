import { useTheme } from '../Contexts/ThemeContext';
import { HiOutlineSun, HiOutlineMoon, HiOutlineDesktopComputer } from 'react-icons/hi';

const modes = [
    { value: 'light',  icon: HiOutlineSun,             label: 'Light'  },
    { value: 'dark',   icon: HiOutlineMoon,             label: 'Dark'   },
    { value: 'system', icon: HiOutlineDesktopComputer,  label: 'System' },
];

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5 border border-slate-200 dark:border-slate-700">
            {modes.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={label}
                    className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs transition-all duration-200
                        ${theme === value
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                        }
                    `}
                >
                    <Icon className="w-3.5 h-3.5" />
                </button>
            ))}
        </div>
    );
}
