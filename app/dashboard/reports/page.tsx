"use client";

import { motion } from "framer-motion";
import {
    FiPieChart,
    FiTrendingUp,
    FiTrendingDown,
    FiDollarSign,
    FiCalendar
} from "react-icons/fi";
import StatCard from "@/app/components/StatCard";

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Insights and analytics for your business.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-4 py-2 rounded-xl glass border border-gray-200 dark:border-gray-800 text-sm font-bold outline-none">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>Year to Date</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    label="Total Revenue"
                    value="$24,500"
                    trend="+12%"
                    trendUp={true}
                    icon={FiTrendingUp}
                    color="bg-emerald-600"
                />
                <StatCard
                    label="Total Expenses"
                    value="$8,200"
                    trend="-5%"
                    trendUp={true}
                    icon={FiTrendingDown}
                    color="bg-red-600"
                />
                <StatCard
                    label="Net Profit"
                    value="$16,300"
                    trend="+18%"
                    trendUp={true}
                    icon={FiDollarSign}
                    color="bg-brand-primary"
                />
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <FiPieChart size={64} className="text-gray-200 dark:text-gray-800 mb-4" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Analytics are being prepared</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold max-w-sm text-center">
                    We're processing your invoices and expenses. Visual reports will be available once we have at least 30 days of data.
                </p>
            </div>
        </div>
    );
}
