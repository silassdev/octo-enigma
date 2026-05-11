"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiPlus, FiLoader, FiCalendar, FiFlag } from "react-icons/fi";
import { saveTask } from "@/lib/actions";
import { Task } from "@/lib/types";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TaskModal({ isOpen, onClose, onSuccess }: TaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [label, setLabel] = useState("");
    const [type, setType] = useState<'high' | 'medium' | 'low'>('medium');
    const [time, setTime] = useState("Today");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!label.trim()) return;

        setLoading(true);
        try {
            await saveTask({
                label,
                time,
                type,
                completed: false
            });
            toast.success("Task added to your list!");
            setLabel("");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to add task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="p-8 sm:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                        Quick Task
                                    </h2>
                                    <p className="text-gray-400 text-xs font-bold mt-1 tracking-widest uppercase">What do you need to do?</p>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-gray-400">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <input
                                        autoFocus
                                        required
                                        type="text"
                                        placeholder="e.g. Call client about design..."
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                            <FiFlag /> Priority
                                        </label>
                                        <div className="flex gap-1 bg-gray-50 dark:bg-slate-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800">
                                            {(['high', 'medium', 'low'] as const).map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setType(p)}
                                                    className={clsx(
                                                        "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                        type === p 
                                                            ? (p === 'high' ? 'bg-red-500 text-white shadow-lg' : p === 'medium' ? 'bg-orange-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg')
                                                            : "text-gray-400 hover:text-slate-900 dark:hover:text-white"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                            <FiCalendar /> Schedule
                                        </label>
                                        <select
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-xs font-bold appearance-none focus:ring-2 focus:ring-brand-primary transition-all"
                                        >
                                            <option>Today</option>
                                            <option>Tomorrow</option>
                                            <option>Next Week</option>
                                            <option>Pending</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || !label}
                                        className="w-full py-4 rounded-2xl bg-brand-primary text-white text-xs font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <FiLoader className="animate-spin" /> : <FiPlus />}
                                        Save Quick Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

