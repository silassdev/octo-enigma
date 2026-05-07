"use client";

import { clsx } from "clsx";
import { IconType } from "react-icons";

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: IconType;
    color: string;
}

export default function StatCard({ label, value, trend, trendUp, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
                <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300",
                    color
                )}>
                    <Icon className="w-7 h-7" />
                </div>
                {trend && (
                    <span className={clsx(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl",
                        trendUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    )}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</h3>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</p>
            </div>
        </div>
    );
}
