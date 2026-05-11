"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiUser, FiFileText, FiBriefcase, FiX, FiDollarSign } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const actions = [
        { id: 'new-contact', title: 'Create New Contact', icon: <FiUser />, shortcut: 'C', link: '/dashboard/contacts/new' },
        { id: 'new-invoice', title: 'Create New Invoice', icon: <FiFileText />, shortcut: 'I', link: '/dashboard/invoices/new' },
        { id: 'new-project', title: 'Create New Project', icon: <FiBriefcase />, shortcut: 'P', link: '/dashboard/projects/new' },
        { id: 'new-expense', title: 'Record New Expense', icon: <FiDollarSign />, shortcut: 'E', link: '/dashboard/expenses/new' },
        { id: 'go-dashboard', title: 'Go to Dashboard', icon: <FiSearch />, shortcut: 'D', link: '/dashboard' },
    ];

    const filteredActions = actions.filter(action => 
        action.title.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleAction = useCallback((link: string) => {
        setIsOpen(false);
        router.push(link);
    }, [router]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                            <FiSearch className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="What do you want to do? (Type to search...)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white font-bold"
                            />
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                <FiX className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {filteredActions.length > 0 ? (
                                filteredActions.map((action) => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleAction(action.link)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-brand-primary/5 hover:text-brand-primary text-slate-700 dark:text-slate-300 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                                                {action.icon}
                                            </div>
                                            <span className="font-bold text-sm">{action.title}</span>
                                        </div>
                                        <kbd className="hidden sm:flex h-5 w-5 items-center justify-center rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-[10px] font-black text-gray-400 group-hover:border-brand-primary/30 group-hover:text-brand-primary">
                                            {action.shortcut}
                                        </kbd>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm font-bold">
                                    No results found for "{query}"
                                </div>
                            )}
                        </div>
                        
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center gap-4">
                                <span>↑↓ to navigate</span>
                                <span>↲ to select</span>
                            </div>
                            <span>esc to close</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
