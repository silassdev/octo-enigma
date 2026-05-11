"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShield, FiArrowRight, FiLock, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface SupportGuardModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'login' | 'upgrade';
}

export default function SupportGuardModal({ isOpen, onClose, mode }: SupportGuardModalProps) {
    const router = useRouter();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 dark:border-white/5"
                    >
                        {/* Decorative Top Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />

                        <div className="p-12 text-center">
                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className="absolute top-8 right-8 p-3 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                            >
                                <FiX />
                            </button>

                            {/* Iconography */}
                            <div className="mb-10 inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-brand-primary/10 text-brand-primary text-4xl shadow-inner relative group">
                                <div className="absolute inset-0 rounded-[2.5rem] bg-brand-primary/20 animate-ping opacity-20" />
                                {mode === 'login' ? <FiLock /> : <FiStar className="text-amber-500" />}
                            </div>

                            {/* Typography */}
                            <h2 className="text-4xl font-black mb-6 tracking-tighter leading-tight text-slate-900 dark:text-white">
                                {mode === 'login' ? 'Reserved Space.' : 'Elevate your Strata.'}
                            </h2>
                            
                            <p className="text-xl text-slate-400 dark:text-gray-400 font-bold mb-12 px-4 leading-relaxed">
                                {mode === 'login' 
                                    ? "Direct support tickets are reserved for our Professional and Infinite tier members. Please log in to view your operational status."
                                    : "You are currently in the Community tier. Direct high-velocity support is exclusive to our Professional strata. Ready to upgrade?"
                                }
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={() => {
                                        router.push(mode === 'login' ? "/login" : "/pricing");
                                        onClose();
                                    }}
                                    className="w-full py-6 rounded-2xl bg-brand-primary text-white font-black text-xl shadow-2xl shadow-brand-primary/25 hover:bg-brand-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                >
                                    {mode === 'login' ? 'Join the Strata' : 'Refine my Plan'} <FiArrowRight />
                                </button>
                                
                                <button 
                                    onClick={onClose}
                                    className="w-full py-5 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-500 font-black text-lg hover:text-slate-900 dark:hover:text-white transition-all"
                                >
                                    Continue reading Docs
                                </button>
                            </div>
                        </div>

                        {/* Subtle Branding Bottom */}
                        <div className="py-6 bg-slate-50 dark:bg-white/5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-gray-600">
                            MicroCRM / Professional Support Gate
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
