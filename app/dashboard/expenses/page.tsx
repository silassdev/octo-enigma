"use client";

import React, { useState, useEffect } from "react";
import { 
    FiPlus, 
    FiDollarSign, 
    FiSearch, 
    FiFilter, 
    FiCalendar, 
    FiPieChart, 
    FiTrendingUp, 
    FiBriefcase, 
    FiLoader,
    FiEdit3,
    FiTrash2
} from "react-icons/fi";
import { getExpenses } from "@/lib/actions";
import { Expense } from "@/lib/types";
import ExpenseModal from "@/app/components/ExpenseModal";
import { toast } from "react-hot-toast";

const CATEGORIES = ["All", "Software", "Travel", "Hardware", "Marketing", "Consulting", "Office", "Other"];

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<(Expense & { contactName?: string; projectName?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [filterCategory, setFilterCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchExpenses = async () => {
        setLoading(true);
        const data = await getExpenses();
        setExpenses(data as any);
        setLoading(false);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const filteredExpenses = expenses.filter(e => {
        const matchesCategory = filterCategory === "All" || e.category === filterCategory;
        const matchesSearch = e.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              e.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const softwareExpenses = filteredExpenses.filter(e => e.category === "Software").reduce((sum, e) => sum + e.amount, 0);
    const marketingExpenses = filteredExpenses.filter(e => e.category === "Marketing").reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Expenses <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Track every dollar of your business spending</p>
                </div>
                <button 
                    onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
                    className="group bg-brand-primary text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-brand-primary/40 hover:bg-brand-dark transition-all transform hover:-translate-y-1 active:scale-95"
                >
                    <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Record Expense
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <FiTrendingUp className="absolute right-[-20px] top-[-20px] w-40 h-40 text-white/5 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Total Expenses</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">${totalExpenses.toLocaleString()}</span>
                        <span className="text-xs font-bold opacity-60">this period</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 flex flex-col justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Software & Tools</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                            <FiPieChart className="text-brand-primary" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">${softwareExpenses.toLocaleString()}</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 flex flex-col justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Marketing</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                            <FiTrendingUp className="text-purple-500" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">${marketingExpenses.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Filters & Table Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-gray-50 dark:border-gray-800 overflow-hidden">
                {/* Table Header / Filters */}
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search spending..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                        filterCategory === cat 
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                                            : 'bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-slate-900 dark:hover:text-white border border-gray-100 dark:border-gray-700'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
                        </div>
                    ) : filteredExpenses.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-gray-800">
                                    <th className="px-10 py-6">Date</th>
                                    <th className="px-6 py-6">Category</th>
                                    <th className="px-6 py-6">Project / Client</th>
                                    <th className="px-6 py-6 text-right">Amount</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                                                    <FiCalendar />
                                                </div>
                                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                                    {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                                    {expense.projectName || "General Expense"}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">
                                                    {expense.contactName ? `Client: ${expense.contactName}` : "Business Overhead"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-right font-black text-slate-900 dark:text-white tracking-tight">
                                            ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setEditingExpense(expense); setIsModalOpen(true); }}
                                                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-brand-primary transition-all hover:shadow-lg"
                                                >
                                                    <FiEdit3 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <FiDollarSign className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">No expenses found</h3>
                            <p className="text-gray-400 font-bold text-sm mt-1">Start tracking your spending</p>
                        </div>
                    )}
                </div>
            </div>

            <ExpenseModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchExpenses}
                expense={editingExpense}
            />
        </div>
    );
}

