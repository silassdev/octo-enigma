'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md group active:scale-90"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ y: 30, opacity: 0, rotate: isDark ? -45 : 45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -30, opacity: 0, rotate: isDark ? 45 : -45 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                    className="relative z-10"
                >
                    {isDark ? (
                        <FiMoon className="w-6 h-6 text-[#bb86fc]" />
                    ) : (
                        <FiSun className="w-6 h-6 text-[#f59e0b]" />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Background Ripple Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-primary/0 group-hover:from-brand-primary/5 group-hover:to-purple-500/5 transition-all duration-500" />
        </button>
    );
}
