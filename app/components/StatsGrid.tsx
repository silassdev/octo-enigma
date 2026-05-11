"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiFileText, FiDollarSign } from "react-icons/fi";
import { clsx } from "clsx";

interface StatItem {
    label: string;
    value: string;
    trend: string;
    isPositive?: boolean;
}

interface StatsGridProps {
    stats: StatItem[];
}

export default function StatsGrid({ stats = [] }: StatsGridProps) {
    const icons = [FiDollarSign, FiBriefcase, FiUsers, FiFileText];
    const colors = ["bg-emerald-600", "bg-blue-600", "bg-purple-600", "bg-orange-600"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats && stats.length > 0 ? (
                stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={clsx("p-3 rounded-2xl text-white", colors[i % colors.length])}>
                                {React.createElement(icons[i % icons.length], { className: "w-6 h-6" })}
                            </div>
                            {stat.isPositive !== undefined && (
                                <span className={clsx("text-[10px] font-black px-2 py-1 rounded-full", stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                                    {stat.isPositive ? "↑" : "↓"}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                            <p className="text-xs font-bold text-gray-400 mt-2">{stat.trend}</p>
                        </div>
                    </motion.div>
                ))
            ) : (
                [1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse h-[160px]">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4" />
                        <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 mb-2" />
                        <div className="w-16 h-8 bg-gray-100 dark:bg-gray-800" />
                    </div>
                ))
            )}
        </div>
    );
}
