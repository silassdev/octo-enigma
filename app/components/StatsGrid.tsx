"use client";

import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiFileText, FiDollarSign } from "react-icons/fi";
import { clsx } from "clsx";

interface StatsGridProps {
    stats: {
        total: number;
        onboarded: number;
        jobs: { _id: string; count: number }[];
    }
}

export default function StatsGrid({ stats }: StatsGridProps) {
    const displayStats = [
        {
            label: "Total Users",
            value: stats.total.toString(),
            trend: "All time",
            icon: FiUsers,
            color: "bg-blue-600"
        },
        {
            label: "Onboarded",
            value: stats.onboarded.toString(),
            trend: `${((stats.onboarded / (stats.total || 1)) * 100).toFixed(0)}% completion`,
            icon: FiBriefcase,
            color: "bg-purple-600"
        },
        {
            label: "Top Role",
            value: stats.jobs[0]?._id || "N/A",
            trend: stats.jobs[0] ? `${stats.jobs[0].count} users` : "No data",
            icon: FiFileText,
            color: "bg-orange-600"
        },
        {
            label: "Revenue (Mock)",
            value: "$0",
            trend: "Ready to scale",
            icon: FiDollarSign,
            color: "bg-emerald-600"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={clsx("p-3 rounded-2xl text-white", stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                        <p className="text-xs font-bold text-gray-400 mt-2">{stat.trend}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
