"use client";

import { motion } from "framer-motion";
import { FiXCircle, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function BillingCancelPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 mx-auto mb-8"
                >
                    <FiXCircle className="w-12 h-12" />
                </motion.div>
                
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Checkout Cancelled</h1>
                <p className="text-gray-500 dark:text-gray-400 font-bold mb-10 max-w-sm mx-auto">
                    No worries! Your account hasn't been charged. You can upgrade whenever you're ready.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        Back to Dashboard
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <FiArrowLeft /> Review Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
