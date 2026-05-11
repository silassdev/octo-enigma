"use client";

import React, { useState, useEffect } from "react";
import { 
    FiArrowUpRight, 
    FiArrowDownRight, 
    FiPieChart, 
    FiTrendingUp, 
    FiActivity, 
    FiDollarSign, 
    FiClock, 
    FiLoader,
    FiShield,
    FiAlertCircle
} from "react-icons/fi";
import { getReportingData } from "@/lib/actions";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function ReportsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReporting = async () => {
            const res = await getReportingData();
            setData(res);
            setLoading(false);
        };
        fetchReporting();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                    Reports <span className="text-brand-primary">.</span>
                </h1>
                <p className="text-gray-400 font-bold ml-1 tracking-tight">Real-time financial health and tax projections</p>
            </div>

            {/* Top Pulse Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <FiArrowUpRight className="absolute right-[-40px] top-[-40px] w-48 h-48 opacity-10" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Income</h3>
                    <div className="relative z-10">
                        <p className="text-4xl font-black tracking-tighter">${data.totalIncome.toLocaleString()}</p>
                        <p className="text-[10px] font-bold opacity-60 mt-2 flex items-center gap-1">
                            <FiActivity /> From paid invoices
                        </p>
                    </div>
                </div>

                <div className="bg-rose-500 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <FiArrowDownRight className="absolute right-[-40px] top-[-40px] w-48 h-48 opacity-10" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Expenses</h3>
                    <div className="relative z-10">
                        <p className="text-4xl font-black tracking-tighter">${data.totalExpenses.toLocaleString()}</p>
                        <p className="text-[10px] font-bold opacity-60 mt-2 flex items-center gap-1">
                            <FiActivity /> All recorded costs
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <FiDollarSign className="absolute right-[-40px] top-[-40px] w-48 h-48 opacity-10" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Net Profit</h3>
                    <div className="relative z-10">
                        <p className="text-4xl font-black tracking-tighter">${data.netProfit.toLocaleString()}</p>
                        <p className="text-[10px] font-bold opacity-60 mt-2 flex items-center gap-1">
                            <FiTrendingUp /> Take-home earnings
                        </p>
                    </div>
                </div>

                <div className="bg-brand-primary text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <FiShield className="absolute right-[-40px] top-[-40px] w-48 h-48 opacity-10" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Est. Tax Liability</h3>
                    <div className="relative z-10">
                        <p className="text-4xl font-black tracking-tighter">${Math.round(data.estimatedTax).toLocaleString()}</p>
                        <p className="text-[10px] font-bold opacity-60 mt-2 flex items-center gap-1">
                            <FiAlertCircle /> 15% estimated rate
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Performance Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Monthly Performance</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Income
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div> Expenses
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-4 sm:gap-8 justify-between px-4 pb-8 border-b border-gray-100 dark:border-gray-800">
                        {data.monthlyData.map((m: any, i: number) => {
                            const max = Math.max(...data.monthlyData.map((d: any) => Math.max(d.income, d.expenses))) || 1000;
                            const incomeHeight = (m.income / max) * 100;
                            const expenseHeight = (m.expenses / max) * 100;

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group">
                                    <div className="w-full flex justify-center gap-1 h-full items-end">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${incomeHeight}%` }}
                                            className="w-1/3 bg-emerald-500/80 rounded-t-lg group-hover:bg-emerald-500 transition-colors cursor-pointer"
                                        />
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${expenseHeight}%` }}
                                            className="w-1/3 bg-rose-500/80 rounded-t-lg group-hover:bg-rose-500 transition-colors cursor-pointer shadow-lg"
                                        />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{m.name}</span>
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 shadow-2xl min-w-[120px]">
                                        <p className="flex justify-between mb-1">Income: <span className="text-emerald-400 ml-2">${m.income.toLocaleString()}</span></p>
                                        <p className="flex justify-between">Costs: <span className="text-rose-400 ml-2">${m.expenses.toLocaleString()}</span></p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center uppercase">Spending Mix</h3>
                    <div className="space-y-6">
                        {data.expenseCategories.length > 0 ? (
                            data.expenseCategories.sort((a: any, b: any) => b.value - a.value).slice(0, 5).map((cat: any, i: number) => {
                                const percentage = (cat.value / data.totalExpenses) * 100;
                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-900 dark:text-white">{cat.name}</span>
                                            <span className="text-gray-400">{Math.round(percentage)}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className="h-full bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20"
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-10 text-center text-gray-400 font-bold text-sm italic">
                                No expenses recorded yet.
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800">
                        <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-4 group cursor-help">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                                <FiActivity />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 leading-tight">
                                This mix helps you identify potential tax-deductible business overheads.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Insights Footer */}
            <div className="bg-gradient-to-br from-brand-primary/10 to-transparent p-12 rounded-[3.5rem] border border-brand-primary/20 flex flex-col md:flex-row items-center gap-12">
                <div className="w-24 h-24 rounded-[2rem] bg-brand-primary text-white flex items-center justify-center shadow-2xl shadow-brand-primary/40 shrink-0">
                    <FiTrendingUp className="w-12 h-12" />
                </div>
                <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Automated Tax Projection</h4>
                    <p className="text-gray-500 font-bold leading-relaxed max-w-2xl">
                        Based on your Current Net Profit of <span className="text-slate-900 dark:text-white">${data.netProfit.toLocaleString()}</span>, we recommend setting aside <span className="text-brand-primary font-black">${Math.round(data.estimatedTax).toLocaleString()}</span> for your estimated quarterly tax payments. This represents a 15% self-employment tax provision.
                    </p>
                </div>
            </div>
        </div>
    );
}

