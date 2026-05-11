"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight, FiLoader } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-hot-toast";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            toast.success("Upgrade successful! Welcome to Pro.");
            // We could verify the session here if we had a dedicated API, 
            // but the webhook will handle the DB update in the background.
        }
    }, [sessionId]);

    return (
        <div className="text-center py-12">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 mx-auto mb-8"
            >
                <FiCheckCircle className="w-12 h-12" />
            </motion.div>
            
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Upgrade Successful!</h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-10 max-w-sm mx-auto">
                Thank you for upgrading! Your Pro features are now being activated. It may take a minute to reflect in your dashboard.
            </p>

            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 hover:bg-brand-dark transition-all group"
            >
                Go to Dashboard <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}

export default function BillingSuccessPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-brand-primary to-purple-500" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Suspense fallback={<div className="text-center"><FiLoader className="animate-spin w-8 h-8 mx-auto" /></div>}>
                    <SuccessContent />
                </Suspense>
            </div>
        </div>
    );
}
