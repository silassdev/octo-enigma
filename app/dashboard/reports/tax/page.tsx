"use client";

import React, { useState, useEffect } from "react";
import { 
    FiShield, 
    FiCalendar, 
    FiInfo, 
    FiLoader, 
    FiArrowLeft, 
    FiPieChart, 
    FiBriefcase, 
    FiTrendingUp,
    FiCheckCircle,
    FiExternalLink,
    FiActivity,
    FiClock
} from "react-icons/fi";
import { getReportingData } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

const QUARTERLY_DATES = [
    { label: "Q1", due: "April 15", period: "Jan 1 - Mar 31" },
    { label: "Q2", due: "June 15", period: "Apr 1 - May 31" },
    { label: "Q3", due: "Sept 15", period: "Jun 1 - Aug 31" },
    { label: "Q4", due: "Jan 15", period: "Sept 1 - Dec 31" },
];

export default function TaxPredictionPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [taxRate, setTaxRate] = useState(0.15); // Default 15%
    const router = useRouter();

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

    const estimatedTax = Math.max(0, data.netProfit * taxRate);
    const quarterlyPayment = estimatedTax / 4;

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors mb-4 group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to reports
                    </button>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Tax Prediction <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Projected liability based on current net profit</p>
                </div>
                
                {/* Rate Selector */}
                <div className="bg-gray-50 dark:bg-slate-900 p-2 rounded-2xl flex gap-1 border border-gray-100 dark:border-gray-700">
                    {[0.10, 0.15, 0.20, 0.25].map(rate => (
                        <button
                            key={rate}
                            onClick={() => setTaxRate(rate)}
                            className={clsx(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                taxRate === rate 
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                                    : "text-gray-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            {rate * 100}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Liability Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                    <FiShield className="absolute right-[-40px] top-[-40px] w-64 h-64 text-white opacity-5" />
                    <div className="relative z-10 space-y-4 text-center md:text-left">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Estimated Annual Liability</h3>
                        <p className="text-7xl font-black tracking-tighter text-brand-primary">
                            ${Math.round(estimatedTax).toLocaleString()}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2">
                                <FiCheckCircle className="text-emerald-400" /> Based on ${data.netProfit.toLocaleString()} net income
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2">
                                <FiInfo className="text-brand-primary" /> {taxRate * 100}% projected rate
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800 flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Quarterly Payment</h3>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                            ${Math.round(quarterlyPayment).toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed">
                            Amount to set aside or pay each quarter to avoid underpayment penalties.
                        </p>
                    </div>
                    <div className="pt-6">
                        <button className="w-full py-4 rounded-2xl bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2">
                            IRS Payment Portal <FiExternalLink />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quarterly Schedule & Deductions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Schedule */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Estimated Payment Schedule</h3>
                    <div className="space-y-4">
                        {QUARTERLY_DATES.map((q, i) => (
                            <div key={i} className="group p-6 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center shadow-sm">
                                        <span className="text-xs font-black text-brand-primary">{q.label}</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white text-sm">Due {q.due}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{q.period}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 dark:text-white">${Math.round(quarterlyPayment).toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Recommended</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deductions Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Deduction Opportunity</h3>
                    <p className="text-gray-400 text-sm font-bold mb-8">Recent spending by category (likely deductible)</p>
                    
                    <div className="space-y-6 flex-grow">
                        {data.expenseCategories.map((cat: any, i: number) => {
                            const iconMap: any = {
                                "Software": <FiActivity />,
                                "Hardware": <FiBriefcase />,
                                "Travel": <FiTrendingUp />,
                                "Marketing": <FiPieChart />
                            };
                            return (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-brand-primary transition-colors">
                                            {iconMap[cat.name] || <FiClock />}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white text-sm">{cat.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deductible Expense</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900 dark:text-white">${cat.value.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Calculated</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] relative overflow-hidden">
                        <FiTrendingUp className="absolute right-[-20px] top-[-20px] w-32 h-32 text-brand-primary opacity-20" />
                        <h4 className="text-white font-black text-sm mb-1 relative z-10">Maximize Deductions</h4>
                        <p className="text-gray-400 text-[10px] font-bold leading-relaxed relative z-10">
                            Ensuring you record every business-related expense can significantly lower your taxable net income and final liability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

