"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiDollarSign, FiCalendar, FiTag, FiBriefcase, FiUser, FiFileText, FiSave, FiLoader } from "react-icons/fi";
import { Expense, Project, Contact } from "@/lib/types";
import { getProjects, getContacts, saveExpense } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    expense?: Expense | null;
}

const CATEGORIES = [
    "Software", "Travel", "Hardware", "Marketing", "Consulting", "Office", "Other"
];

export default function ExpenseModal({ isOpen, onClose, onSuccess, expense }: ExpenseModalProps) {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [formData, setFormData] = useState<Partial<Expense>>({
        amount: 0,
        category: "Software",
        date: new Date().toISOString().split('T')[0],
        notes: "",
        projectId: "",
        contactId: ""
    });

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const [p, c] = await Promise.all([getProjects(), getContacts()]);
                setProjects(p);
                setContacts(c);
            };
            fetchData();
            
            if (expense) {
                setFormData({
                    ...expense,
                    date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                });
            } else {
                setFormData({
                    amount: 0,
                    category: "Software",
                    date: new Date().toISOString().split('T')[0],
                    notes: "",
                    projectId: "",
                    contactId: ""
                });
            }
        }
    }, [isOpen, expense]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveExpense(formData);
            toast.success(expense ? "Expense updated!" : "Expense recorded!");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
                        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="p-8 sm:p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                        {expense ? "Edit Expense" : "New Expense"}
                                    </h2>
                                    <p className="text-gray-400 text-sm font-bold mt-1 tracking-tight">Record your business spending</p>
                                </div>
                                <button onClick={onClose} className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-gray-400 hover:text-slate-900 dark:hover:text-white">
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Amount</label>
                                        <div className="relative">
                                            <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                value={formData.amount || ""}
                                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date</label>
                                        <div className="relative">
                                            <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                required
                                                type="date"
                                                value={formData.date || ""}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={clsx(
                                                    "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    formData.category === cat
                                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                                        : "bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-slate-900 dark:hover:text-white"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Project (Optional)</label>
                                        <div className="relative">
                                            <FiBriefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                value={formData.projectId || ""}
                                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold appearance-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            >
                                                <option value="">No Project</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Client (Optional)</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                value={formData.contactId || ""}
                                                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                                                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold appearance-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            >
                                                <option value="">No Client</option>
                                                {contacts.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Notes</label>
                                    <div className="relative">
                                        <FiFileText className="absolute left-5 top-6 text-gray-400" />
                                        <textarea
                                            value={formData.notes || ""}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all min-h-[100px]"
                                            placeholder="Add details about this expense..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-4 px-6 rounded-2xl bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100 dark:border-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 px-6 rounded-2xl bg-brand-primary text-white text-xs font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                                        {expense ? "Update Expense" : "Record Expense"}
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

