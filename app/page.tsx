"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    FiCheckCircle,
    FiInbox,
    FiTrendingUp,
    FiCreditCard,
    FiArrowRight,
    FiLayout,
    FiCpu,
    FiTarget,
    FiZap,
    FiGlobe,
    FiShield
} from "react-icons/fi";
import { useAuth } from "@/app/components/AuthProvider";
import { clsx } from "clsx";

export default function Home() {
    const { user, loading } = useAuth();

    return (
        <main className="relative overflow-hidden bg-white dark:bg-[#050505] text-slate-900 dark:text-white selection:bg-brand-primary/20 selection:text-brand-primary">
            {/* High-Fidelity Background Engine */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Hero: The Vision Statement */}
            <section className="container pt-32 pb-24 md:pt-48 md:pb-40 relative z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 backdrop-blur-xl mb-10 shadow-sm">
                            <FiZap className="text-amber-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                The Future of Independent Work
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-10 tracking-tighter leading-[0.85] md:leading-[0.85]">
                            Focus on <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-indigo-500 to-blue-600">
                                Output.
                            </span>
                        </h1>

                        <p className="text-xl md:text-3xl text-slate-400 dark:text-gray-500 mb-16 max-w-3xl mx-auto leading-tight font-bold tracking-tight">
                            One minimalist workspace for your leads, projects, and revenue. <br className="hidden md:block" />
                            Engineered for zero-friction operations.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[90px]">
                            {!loading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
                                >
                                    {user ? (
                                        <Link
                                            href="/dashboard"
                                            className="group relative px-12 py-6 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:-translate-y-2 transition-all flex items-center justify-center gap-4"
                                        >
                                            <FiLayout className="text-brand-primary" /> Return to Dashboard <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href="/auth/register"
                                                className="group relative px-10 py-5 rounded-2xl bg-brand-primary text-white font-black text-lg shadow-2xl shadow-brand-primary/30 hover:bg-brand-dark hover:-translate-y-2 transition-all overflow-hidden"
                                            >
                                                Start Building Free
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            </Link>
                                            <Link
                                                href="/pricing"
                                                className="px-10 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-black text-lg hover:bg-slate-50 dark:hover:bg-white/10 hover:-translate-y-2 transition-all shadow-sm"
                                            >
                                                View Strata
                                            </Link>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bento Section: The Core Engine */}
            <section className="container py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[300px] md:auto-rows-[350px]">

                        {/* FEATURE 1: CRM (Large Bento) */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="md:col-span-8 md:row-span-2 rounded-[3.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-12 flex flex-col justify-between group overflow-hidden relative"
                        >
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-3xl shadow-xl mb-10 group-hover:rotate-6 transition-transform">
                                    <FiInbox />
                                </div>
                                <h3 className="text-4xl font-black mb-6 tracking-tighter">Smart Client Flow.</h3>
                                <p className="text-xl text-slate-400 font-bold max-w-md leading-snug">
                                    Zero-latency lead management. <br />
                                    Tag, track, and convert with absolute precision.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {['Leads', 'Pipeline', 'Archives'].map(tag => (
                                    <span key={tag} className="px-4 py-1.5 rounded-full bg-white dark:bg-black/20 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 dark:border-white/10">{tag}</span>
                                ))}
                            </div>
                        </motion.div>

                        {/* FEATURE 2: Invoicing (Small Bento) */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="md:col-span-4 rounded-[3.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-10 flex flex-col justify-between group border border-white/10 dark:border-slate-200 shadow-2xl"
                        >
                            <div className="flex justify-between items-start text-brand-primary">
                                <FiCreditCard className="text-4xl" />
                                <FiCheckCircle className="text-2xl opacity-40" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Instant Billing.</h3>
                                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Get paid 3x faster.</p>
                            </div>
                        </motion.div>

                        {/* FEATURE 3: Expenses (Small Bento) */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="md:col-span-4 rounded-[3.5rem] bg-indigo-600 p-10 text-white flex flex-col justify-between group shadow-xl shadow-indigo-500/20"
                        >
                            <FiTrendingUp className="text-4xl mb-10" />
                            <div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Revenue IQ.</h3>
                                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Real-time burn tracking.</p>
                            </div>
                        </motion.div>

                        {/* FEATURE 4: Projects (Wide Bento) */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="md:col-span-4 md:row-span-1 rounded-[3.5rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 p-10 flex flex-col justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5"><FiTarget className="text-emerald-500" /></div>
                                <h4 className="text-sm font-black uppercase tracking-widest">Milestones</h4>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Project Canvas.</h3>
                                <p className="text-sm font-bold text-slate-400">Task orchestration that stays out of your way.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Strategic Trust Section */}
            <section className="container py-24 px-6 border-t border-slate-50 dark:border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-600 mb-12">The Preferred Choice for High-Performance Operators</h5>
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all">
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter"><FiGlobe /> GLOBE</div>
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter"><FiCpu /> SYNC</div>
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter"><FiShield /> GUARD</div>
                    </div>
                </div>
            </section>

            {/* CTA Bottom: Reactive Final Conversion */}
            <AnimatePresence>
                {!user && !loading && (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="container py-40 text-center relative overflow-hidden px-6"
                    >
                        <div className="max-w-4xl mx-auto relative z-10 p-20 rounded-[4rem] bg-slate-900 text-white shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none"
                            >
                                Reclaim your <br />
                                <span className="text-brand-primary">Billable Hours.</span>
                            </motion.h2>
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center gap-4 px-14 py-7 rounded-full bg-white text-slate-900 font-black text-2xl hover:scale-105 hover:shadow-2xl transition-all shadow-xl"
                            >
                                Join MicroCRM <FiArrowRight />
                            </Link>
                            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Start instant. No card required.</p>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <footer className="container py-12 border-t border-slate-50 dark:border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400"> MicroCRM . Freelance Suite</p>
            </footer>
        </main>
    );
}
