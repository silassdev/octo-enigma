"use client";

import React, { useState, useEffect } from "react";
import { 
    FiUsers, 
    FiDollarSign, 
    FiBriefcase, 
    FiTrendingUp, 
    FiLoader, 
    FiActivity, 
    FiPieChart, 
    FiBarChart2,
    FiShield
} from "react-icons/fi";
import { getAdminStats } from "@/lib/actions";
import { useAuth } from "@/app/components/AuthProvider";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area 
} from "recharts";
import { clsx } from "clsx";

export default function AdminOverview() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            if (authLoading || !user) return;
            setLoading(true);
            const data = await getAdminStats();
            setStats(data);
            setLoading(false);
        };
        fetchAdminData();
    }, [user, authLoading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        { label: "Total Platform Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: "bg-emerald-500", trend: "+12% this month" },
        { label: "Active Platform Users", value: stats.totalUsers.toLocaleString(), icon: <FiUsers />, color: "bg-brand-primary", trend: "+3 new today" },
        { label: "Global Projects", value: stats.totalProjects.toLocaleString(), icon: <FiBriefcase />, color: "bg-blue-500", trend: "High activity" },
        { label: "System Overhead", value: `$${stats.totalExpenses.toLocaleString()}`, icon: <FiActivity />, color: "bg-orange-500", trend: "Stability: 99.9%" },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-10">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-brand-primary shadow-xl">
                            <FiShield className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary bg-brand-primary/10 px-4 py-1.5 rounded-full">
                            Admin Command Center
                        </span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        System Overview <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Real-time platform metrics and global revenue tracking</p>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <button className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white transition-all">
                        Real-time Stream
                    </button>
                    <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all">
                        Download Log
                    </button>
                </div>
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 hover:border-brand-primary/20 transition-all duration-500 overflow-hidden">
                        <div className={clsx(
                            "absolute top-0 right-0 w-32 h-32 opacity-5 -mr-10 -mt-10 rounded-full",
                            card.color
                        )} />
                        <div className="relative z-10 space-y-4">
                            <div className={clsx(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                                card.color
                            )}>
                                {card.icon}
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{card.label}</h3>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{card.value}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <FiTrendingUp className="text-emerald-500 w-3 h-3" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Revenue Growth */}
                <div className="lg:col-span-8 bg-slate-900 p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                    <FiDollarSign className="absolute right-[-40px] top-[-40px] w-64 h-64 text-white opacity-5" />
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Global Revenue Stream</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Last 6 Months Projection</p>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-xl text-brand-primary font-black text-[10px] uppercase tracking-widest border border-white/5">
                            Platform Beta v1.2
                        </div>
                    </div>
                    
                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
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
                                        backgroundColor: '#0f172a', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: '900',
                                        color: '#fff'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#818cf8" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Plan Distribution */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">User Segments</h2>
                        <div className="space-y-6">
                            {[
                                { label: "Free Tier", value: stats.planDistribution.free, color: "bg-slate-100 dark:bg-slate-800", iconCol: "text-gray-400" },
                                { label: "Pro Monthly", value: stats.planDistribution.pro, color: "bg-brand-primary/10", iconCol: "text-brand-primary" },
                                { label: "Lifetime LTD", value: stats.planDistribution.lifetime, color: "bg-amber-100 dark:bg-amber-900/30", iconCol: "text-amber-500" },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-800/30 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx("w-3 h-3 rounded-full", p.iconCol.replace('text-', 'bg-'))} />
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{p.label}</p>
                                            <p className="text-[10px] font-bold text-gray-400 italic">User Growth Path</p>
                                        </div>
                                    </div>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{p.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden">
                            <FiBarChart2 className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-brand-primary opacity-20" />
                            <h4 className="text-white font-black text-sm mb-1 relative z-10">System Status</h4>
                            <div className="flex items-center gap-2 relative z-10">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">All Engines Nominal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

