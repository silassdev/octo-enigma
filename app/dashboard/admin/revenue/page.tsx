"use client";

import React, { useState, useEffect } from "react";
import { 
    FiDollarSign, 
    FiTrendingUp, 
    FiTrendingDown, 
    FiActivity, 
    FiPieChart, 
    FiLoader,
    FiArrowUpRight,
    FiArrowDownRight,
    FiCheckCircle,
    FiClock,
    FiRefreshCcw
} from "react-icons/fi";
import { getAdminRevenueData } from "@/lib/actions";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useAuth } from "@/app/components/AuthProvider";

export default function AdminRevenuePage() {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchRevenue = async () => {
        if (authLoading || !user) return;
        setLoading(true);
        const result = await getAdminRevenueData();
        setData(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchRevenue();
    }, [user, authLoading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        { label: "Net Platform Revenue", value: `$${data.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Total Operational Burn", value: `$${data.totalExpenses.toLocaleString()}`, icon: <FiTrendingDown />, color: "text-rose-500", bg: "bg-rose-500/10" },
        { label: "Estimated Platform Profit", value: `$${data.profit.toLocaleString()}`, icon: <FiTrendingUp />, color: "text-brand-primary", bg: "bg-brand-primary/10" },
        { label: "Yield Margin", value: `${((data.profit / data.totalRevenue) * 100).toFixed(1)}%`, icon: <FiActivity />, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Revenue Forensics <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Real-time platform yield and transaction monitoring</p>
                </div>
                <button 
                    onClick={fetchRevenue}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-400 hover:text-slate-900 dark:hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    <FiRefreshCcw /> Sync Financials
                </button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 relative overflow-hidden group">
                        <div className={clsx("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full", s.bg)} />
                        <div className="relative z-10 space-y-4">
                            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg", s.bg, s.color)}>
                                {s.icon}
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{s.label}</h4>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-slate-900 p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Revenue vs Burn Trajectory</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Global Platform Stream</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-brand-primary" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Expenses</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.monthlyBreakdown}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }} 
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1e293b', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: '900',
                                        color: '#fff'
                                    }} 
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={4} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={4} fill="url(#colorExp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Yield by Segment</h2>
                    <div className="space-y-8">
                        {[
                            { label: "Pro Subscriptions", value: data.planYield.pro, color: "bg-brand-primary" },
                            { label: "Lifetime LTD", value: data.planYield.lifetime, color: "bg-amber-500" },
                        ].map((p, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{p.label}</h4>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">${p.value.toLocaleString()}</p>
                                </div>
                                <div className="h-4 w-full bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.value / data.totalRevenue) * 100}%` }}
                                        className={clsx("h-full rounded-full shadow-inner", p.color)} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 rounded-[2.5rem] bg-indigo-50/50 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700">
                        <FiPieChart className="w-8 h-8 text-indigo-500 mb-4" />
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">Growth Insight</h4>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                            Lifetime LTD revenue remains the primary capital source. Pro adoption is scaling at 14% MoM.
                        </p>
                    </div>
                </div>
            </div>

            {/* Platform Transaction Log */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Platform Transaction Log</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Last 20 Global Receipts</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Transaction ID</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User / Entity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Yield</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Segment</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {data.transactions.map((tx: any) => (
                                <tr key={tx.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all">
                                    <td className="px-10 py-8 font-black text-slate-400 text-[10px] tracking-widest">
                                        TXN-{tx.id.slice(0, 8).toUpperCase()}
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{tx.userName}</p>
                                            <p className="text-[10px] font-bold text-gray-400 italic truncate opacity-60">{tx.userEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 font-black text-slate-900 dark:text-brand-primary text-lg">
                                        ${tx.total.toLocaleString()}
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className={clsx(
                                            "inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                            tx.plan === 'pro' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" :
                                            tx.plan === 'lifetime' ? "bg-amber-100 text-amber-600 border-amber-200" :
                                            "bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                                        )}>
                                            {tx.plan}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

