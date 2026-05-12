"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    FiChevronLeft,
    FiCheck,
    FiZap,
    FiAward,
    FiStar,
    FiShield,
    FiCpu,
    FiArrowRight,
    FiX,
    FiCheckCircle
} from "react-icons/fi";
import { clsx } from "clsx";

const plans = [
    {
        id: "free",
        name: "Free",
        desc: "Essential CRM tooling for solo creators and open-source believers.",
        price: "0",
        period: "forever",
        icon: <FiCpu />,
        color: "text-slate-400",
        bgColor: "bg-slate-50 dark:bg-slate-800",
        features: [
            "Up to 10 Projects",
            "Limited Invoice Creation",
            "Basic Contact Management",
            "Individual Task Tracking",
            "Public API Access",
            "Community Support"
        ],
        cta: "Start for Free",
        highlight: false
    },
    {
        id: "pro",
        name: "Professional",
        desc: "High-performance orchestration for developers and small teams.",
        price: "1.99",
        period: "per month",
        icon: <FiZap />,
        color: "text-brand-primary",
        bgColor: "bg-brand-primary/5",
        features: [
            "Unlimited Projects",
            "Granular Revenue Forensics",
            "Automated Invoicing",
            "Priority Pro Support (24h)",
            "Advanced User Directory",
            "Platform Activity Logs",
            "Custom Branding (Beta)"
        ],
        cta: "Upgrade to Pro",
        highlight: true,
        badge: "Most Popular"
    },
    {
        id: "lifetime",
        name: "Infinite",
        desc: "One investment for eternal access. For the visionaries and early adopters.",
        price: "69.9",
        period: "one-time",
        icon: <FiAward />,
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/10",
        features: [
            "Everything in Professional",
            "Lifetime License & Updates",
            "Exclusive Beta Access",
            "Early Adopter Achievement",
            "Private Admin Hotline",
            "Custom Feature Requests"
        ],
        cta: "Claim Lifetime Access",
        highlight: false
    }
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    return (
        <main className="relative overflow-hidden min-h-screen bg-white dark:bg-slate-950">
            {/* Ultra-Premium Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            <div className="container px-6 py-12 md:py-20 lg:py-32 max-w-7xl mx-auto relative z-10">
                {/* Navigation & Brand */}
                <div className="flex items-center justify-between mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link href="/login" className="group flex items-center gap-3 text-slate-400 hover:text-brand-primary transition-all font-black uppercase tracking-[0.2em] text-[10px]">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                <FiChevronLeft />
                            </div>
                            Back to Access
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                        <FiStar className="text-amber-500" /> Transparent Tiering . Optimized for Growth
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-600"
                    >
                        Modern Pricing <br />
                        <span className="text-brand-primary">for Modern CRM.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 font-bold tracking-tight leading-relaxed"
                    >
                        No hidden fees. No complicated contracts. <br />
                        Choose the stratum that matches your ambition.
                    </motion.p>
                </div>

                {/* Pricing Toggle (Conceptual) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-4 mb-20 scale-110"
                >
                    <span className={clsx("text-xs font-black uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400')}>Monthly</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-16 h-8 rounded-full bg-slate-100 dark:bg-slate-800 p-1.5 relative transition-all shadow-inner"
                    >
                        <motion.div
                            animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                            className="w-5 h-5 rounded-full bg-brand-primary shadow-lg shadow-brand-primary/20"
                        />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={clsx("text-xs font-black uppercase tracking-widest transition-colors", billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400')}>Yearly</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest">SAVE $7.08</span>
                    </div>
                </motion.div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {plans.map((plan, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            key={plan.id}
                            className={clsx(
                                "group relative flex flex-col p-10 rounded-[3.5rem] border transition-all duration-500 hover:-translate-y-4 shadow-2xl",
                                plan.highlight
                                    ? "bg-slate-900 dark:bg-white border-brand-primary/50 text-white dark:text-slate-900 z-10"
                                    : "bg-white dark:bg-slate-900 border-gray-50 dark:border-slate-800 text-slate-900 dark:text-white"
                            )}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/40">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-10 flex items-center justify-between">
                                <div className={clsx(
                                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner transition-all group-hover:scale-110",
                                    plan.bgColor, plan.color
                                )}>
                                    {plan.icon}
                                </div>
                                <div className={clsx(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    plan.highlight ? "border-white/20 bg-white/10" : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                                )}>
                                    Tier {i + 1}
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h3 className="text-3xl font-black tracking-tight">{plan.name}</h3>
                                <p className={clsx(
                                    "text-sm font-bold tracking-tight leading-relaxed transition-colors",
                                    plan.highlight ? "text-slate-400 dark:text-slate-500" : "text-gray-400"
                                )}>
                                    {plan.desc}
                                </p>
                            </div>

                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-5xl font-black tracking-tighter">${(billingCycle === 'yearly' && plan.id === 'pro') ? '16.80' : plan.price}</span>
                                <span className={clsx(
                                    "text-xs font-black uppercase tracking-widest transition-colors",
                                    plan.highlight ? "text-slate-500" : "text-gray-400"
                                )}>
                                    {(billingCycle === 'yearly' && plan.id === 'pro') ? 'per year' : plan.period}
                                </span>
                            </div>

                            <div className="space-y-6 mb-12 flex-1">
                                {plan.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group/item">
                                        <div className={clsx(
                                            "w-6 h-6 rounded-lg flex items-center justify-center transition-all group-hover/item:scale-110 shadow-sm",
                                            plan.highlight ? "bg-brand-primary text-white" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
                                        )}>
                                            <FiCheck />
                                        </div>
                                        <span className={clsx(
                                            "text-xs font-black tracking-tight transition-colors",
                                            plan.highlight ? "text-slate-200 dark:text-slate-700" : "text-slate-600 dark:text-slate-300"
                                        )}>
                                            {feat}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/auth/register" className={clsx(
                                "w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl flex items-center justify-center gap-2",
                                plan.highlight
                                    ? "bg-brand-primary text-white hover:bg-white hover:text-slate-900 shadow-brand-primary/20"
                                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-brand-primary hover:text-white"
                            )}>
                                {plan.cta} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / Social Proof / Trust Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-16 rounded-[4rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center"
                >
                    <div className="flex justify-center -space-x-4 mb-8">
                        {[1, 2, 3, 4, 5].map(j => (
                            <div key={j} className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center overflow-hidden">
                                <span className="text-[10px] font-black text-slate-400">DEV{j}</span>
                            </div>
                        ))}
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Trusted by 5,00+ Professional Developers</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Join the highest tier of professional orchestration.</p>
                </motion.div>
            </div>
        </main>
    );
}

