"use client";

import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiFileText, FiDollarSign, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { clsx } from "clsx";

export default function DashboardPage() {
    const stats = [
        { label: "Active Clients", value: "12", trend: "+2 this month", trendUp: true, icon: FiUsers, color: "bg-blue-600" },
        { label: "Open Projects", value: "4", trend: "On track", trendUp: true, icon: FiBriefcase, color: "bg-purple-600" },
        { label: "Pending Invoices", value: "$4,250", trend: "3 overdue", trendUp: false, icon: FiFileText, color: "bg-orange-600" },
        { label: "Monthly Revenue", value: "$8,900", trend: "+15% vs last month", trendUp: true, icon: FiDollarSign, color: "bg-emerald-600" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 rounded-xl glass border border-gray-200 dark:border-gray-800 text-sm font-bold hover:bg-white dark:hover:bg-gray-800 transition-all">
                        Export Report
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center gap-2">
                        <FiPlus /> New Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            Recent Projects <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 uppercase">View All</span>
                        </h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                                            P{i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Modernizing E-commerce API</h4>
                                            <p className="text-xs text-gray-500">TechStack Inc. • Due in 4 days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:block">
                                            <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-primary w-2/3" />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-brand-primary">60%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-xl font-black mb-6">Upcoming Tasks</h2>
                        <div className="space-y-4">
                            {[
                                { label: "Client Meeting", time: "10:30 AM", type: "high" },
                                { label: "Send Invoice #204", time: "2:00 PM", type: "medium" },
                                { label: "Review Design Specs", time: "Tomorrow", type: "low" },
                            ].map((task, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className={clsx(
                                        "w-2 h-2 mt-1.5 rounded-full shrink-0",
                                        task.type === 'high' ? 'bg-red-500' : task.type === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                                    )} />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{task.label}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{task.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 text-sm font-bold hover:border-brand-primary hover:text-brand-primary transition-all">
                            + Add Quick Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
