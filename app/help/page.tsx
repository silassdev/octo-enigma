"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    FiChevronLeft, 
    FiSearch, 
    FiBookOpen, 
    FiCreditCard, 
    FiCpu, 
    FiShield, 
    FiLifeBuoy, 
    FiChevronDown, 
    FiMessageCircle, 
    FiArrowRight, 
    FiPlus,
    FiInbox
} from "react-icons/fi";
import { clsx } from "clsx";

const categories = [
    {
        id: "onboarding",
        title: "Getting Started",
        desc: "Everything you need to set up your first 100% automated CRM.",
        icon: <FiBookOpen />,
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/10"
    },
    {
        id: "crm",
        title: "CRM & Pipelines",
        desc: "Manage leads, projects, and contacts with high-performance tools.",
        icon: <FiInbox />,
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/10"
    },
    {
        id: "billing",
        title: "Plans & Billing",
        desc: "Understanding tiers, invoices, and managing your commercial strata.",
        icon: <FiCreditCard />,
        color: "text-brand-primary",
        bgColor: "bg-brand-primary/5"
    },
    {
        id: "technical",
        title: "Technical & API",
        desc: "Deep-dives into the MicroCRM orchestration engine and API access.",
        icon: <FiCpu />,
        color: "text-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/10"
    }
];

const faqs = [
    {
        q: "What makes MicroCRM different from other CRMs?",
        a: "MicroCRM is engineered specifically for high-performance independent workers. We prioritize 'Focus on Output' by automating the friction-heavy parts of lead tracking, invoicing, and expense management into a single, unified bento dashboard."
    },
    {
        q: "How do I migrate my data from another platform?",
        a: "We offer native CSV and API-based migration tools within the Settings > Data hub. Most migrations take less than 120 seconds to fully synchronize with our canonical collection engine."
    },
    {
        q: "Is my data secure and private?",
        a: "Absolutely. We implement high-fidelity encryption for all data transport and utilize industry-standard OAuth protocols. We are 'Privacy First' by design and never trade or Sell your data."
    },
    {
        q: "What is the 'Infinite' tier?",
        a: "The Infinite tier provides one-time payment for eternal access to all current and future Pro features. It's designed for visionaries who want to lock in professional orchestration forever."
    }
];

import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import SupportGuardModal from "@/app/components/SupportGuardModal";

// ... (categories and faqs remain the same)

export default function HelpPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showGuardModal, setShowGuardModal] = useState(false);
    const [guardMode, setGuardMode] = useState<'login' | 'upgrade'>('login');

    const handleTicketClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (!user) {
            setGuardMode('login');
            setShowGuardModal(true);
            return;
        }

        if (profile?.plan === 'free') {
            setGuardMode('upgrade');
            setShowGuardModal(true);
            return;
        }

        router.push("/dashboard/tickets");
    };

    return (
        <main className="relative overflow-hidden min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white">
            <SupportGuardModal 
                isOpen={showGuardModal} 
                onClose={() => setShowGuardModal(false)} 
                mode={guardMode} 
            />
            {/* Background Aesthetics */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container px-6 py-12 md:py-20 lg:py-24 max-w-6xl mx-auto">
                {/* Back Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link href="/login" className="group inline-flex items-center gap-3 text-slate-400 hover:text-brand-primary transition-all font-black uppercase tracking-widest text-[10px]">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                            <FiChevronLeft />
                        </div>
                        Return to Access
                    </Link>
                </motion.div>

                {/* Hero Support Header */}
                <div className="mb-20 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <FiLifeBuoy className="text-brand-primary" /> Support Systems Operational
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
                            Knowledge <br className="hidden md:block" />
                            Center.
                        </h1>
                    </motion.div>
                    
                    {/* Integrated Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative max-w-2xl group"
                    >
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <FiSearch className="text-slate-400 group-focus-within:text-brand-primary transition-colors text-xl" />
                        </div>
                        <input 
                            type="text"
                            placeholder="How can we help you today?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/30 outline-none transition-all font-bold text-lg shadow-sm"
                        />
                    </motion.div>
                </div>

                {/* Category Strata */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            whileHover={{ y: -8 }}
                            className="group p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl transition-all"
                        >
                            <div className={clsx(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-10 transition-transform group-hover:scale-110",
                                cat.bgColor, cat.color
                            )}>
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-black mb-4 tracking-tight">{cat.title}</h3>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8">
                                {cat.desc}
                            </p>
                            <Link 
                                href={`/help/docs/${cat.id}`}
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:gap-3 transition-all underline underline-offset-8"
                            >
                                Explore Docs <FiArrowRight />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ High-Fidelity Accordion */}
                <div className="mb-32 max-w-4xl mx-auto">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-3xl font-black mb-12 tracking-tight flex items-center gap-4"
                    >
                        <FiShield className="text-emerald-500" /> Frequent Inquiries
                    </motion.h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="rounded-3xl border border-slate-50 dark:border-white/5 overflow-hidden"
                            >
                                <button 
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-8 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                                >
                                    <span className="font-black tracking-tight text-lg">{faq.q}</span>
                                    <FiChevronDown className={clsx("transition-transform duration-300", openFaq === idx ? "rotate-180" : "")} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-8 pb-8"
                                        >
                                            <p className="text-slate-500 dark:text-gray-400 font-bold leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Direct High-Hotline CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="p-16 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-primary opacity-20 rounded-full blur-[80px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Still need an operator?</h2>
                            <p className="text-slate-400 font-bold text-lg max-w-md">Our specialized support engineers are ready to resolve any friction you encounter.</p>
                        </div>
                        <button 
                            onClick={handleTicketClick}
                            className="group px-12 py-6 rounded-[2rem] bg-brand-primary text-white font-black text-xl hover:bg-white hover:text-slate-900 transition-all flex items-center gap-4 shadow-2xl shadow-brand-primary/20"
                        >
                            <FiPlus className="group-hover:rotate-90 transition-transform" /> Open Direct Ticket
                        </button>
                    </div>
                </motion.div>
            </div>

            <footer className="container py-12 border-t border-slate-50 dark:border-white/5 text-center px-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Knowledge Center v2.0 . Secured Environment</p>
            </footer>
        </main>
    );
}
