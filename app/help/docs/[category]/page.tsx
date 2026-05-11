"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
    FiChevronLeft, 
    FiBookOpen, 
    FiCheckCircle, 
    FiCpu, 
    FiInbox, 
    FiCreditCard, 
    FiZap,
    FiShield,
    FiSettings,
    FiTerminal,
    FiDatabase,
    FiTrendingUp,
    FiSmile,
    FiFrown,
    FiMail,
    FiMessageSquare
} from "react-icons/fi";
import { clsx } from "clsx";

const docContent: Record<string, {
    title: string;
    icon: React.ReactNode;
    description: string;
    sections: { title: string; content: string; icon?: React.ReactNode }[];
}> = {
    onboarding: {
        title: "Getting Started",
        icon: <FiBookOpen />,
        description: "Everything you need to set up your first 100% automated CRM.",
        sections: [
            {
                title: "Accelerated Onboarding",
                content: "Connect your GitHub account to sync your identity and professional profile instantly. Our orchestration engine handles the metadata synchronization in the background.",
                icon: <FiZap />
            },
            {
                title: "Your First Lead",
                content: "Navigate to the CRM section and use the 'Quick Add' feature to create your first contact. Tag them as a 'Lead' to trigger the automated follow-up pipeline.",
                icon: <FiInbox />
            },
            {
                title: "Configuring Your Workspace",
                content: "Visit the Settings hub to customize your brand appearance, toggle maintenance modes, and manage your global platform behaviors.",
                icon: <FiSettings />
            }
        ]
    },
    crm: {
        title: "CRM & Pipelines",
        icon: <FiInbox />,
        description: "Manage leads, projects, and contacts with high-performance tools.",
        sections: [
            {
                title: "Pipeline Stratification",
                content: "Categorize your professional network into Leads, Clients, and Archives. Each stratum provides unique forensics and engagement metrics.",
                icon: <FiDatabase />
            },
            {
                title: "Project Orchestration",
                content: "Create projects to bridge the gap between contacts and revenue. Set deadlines, track budgets, and manage tasks with zero friction.",
                icon: <FiCheckCircle />
            },
            {
                title: "Contact Forensics",
                content: "Deep-dive into individual user activity logs. View a chronological audit trail of projects, tasks, and financial transactions.",
                icon: <FiShield />
            }
        ]
    },
    billing: {
        title: "Plans & Billing",
        icon: <FiCreditCard />,
        description: "Understanding tiers, invoices, and managing your commercial strata.",
        sections: [
            {
                title: "Commercial Strata",
                content: "Choose between Community (Free), Professional (Subscription), and Infinite (Lifetime) tiers. Each tier expands your operational capacity.",
                icon: <FiCpu />
            },
            {
                title: "Automated Invoicing",
                content: "Generate professional PDF invoices with a single click. Our system handles calculation, tax reconciliation, and chronostamping.",
                icon: <FiZap />
            },
            {
                title: "Revenue Tracking",
                content: "Monitor your platform-wide financial health through the Revenue Forensics dashboard. Track performance by client, project, or date range.",
                icon: <FiTrendingUp />
            }
        ]
    },
    technical: {
        title: "Technical & API",
        icon: <FiCpu />,
        description: "Deep-dives into the MicroCRM orchestration engine and API access.",
        sections: [
            {
                title: "Orchestration Engine",
                content: "MicroCRM is built on a reactive Firestore architecture, ensuring absolute data integrity and real-time synchronization across all strata.",
                icon: <FiCpu />
            },
            {
                title: "API Fundamentals",
                content: "Professional and Infinite users gain access to our RESTful API. Use your developer token to perform secure cross-platform integrations.",
                icon: <FiTerminal />
            },
            {
                title: "System Governance",
                content: "Administrators can orchestrate platform behavior through the Global Settings API, including maintenance toggles and system-wide metadata controls.",
                icon: <FiSettings />
            }
        ]
    }
};

export default function DocPage() {
    const params = useParams();
    const category = params?.category as string;
    const content = docContent[category];
    const [feedback, setFeedback] = useState<null | 'yes' | 'no'>(null);

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-6 text-slate-900 dark:text-white">Article Not Found</h1>
                    <Link href="/help" className="text-brand-primary font-bold hover:underline">Back to Help Center</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white">
            <div className="container px-6 py-12 md:py-20 lg:py-24 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-16"
                >
                    <Link href="/help" className="group inline-flex items-center gap-3 text-slate-400 hover:text-brand-primary transition-all font-black uppercase tracking-widest text-[10px]">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                            <FiChevronLeft />
                        </div>
                        Back to Knowledge Center
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20"
                >
                    <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-brand-primary/5 text-brand-primary text-3xl mb-8">
                        {content.icon}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">{content.title}</h1>
                    <p className="text-xl text-slate-400 font-bold leading-relaxed">{content.description}</p>
                </motion.div>

                <div className="space-y-16">
                    {content.sections.map((section, idx) => (
                        <motion.section 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative pl-12 border-l-2 border-slate-50 dark:border-white/5"
                        >
                            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400">
                                {section.icon || <FiCheckCircle />}
                            </div>
                            <h2 className="text-2xl font-black mb-4 tracking-tight leading-tight">{section.title}</h2>
                            <p className="text-lg text-slate-500 dark:text-gray-400 font-bold leading-relaxed mb-6">
                                {section.content}
                            </p>
                        </motion.section>
                    ))}
                </div>

                <div className="mt-32 p-12 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {feedback === null ? (
                            <motion.div 
                                key="initial"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center"
                            >
                                <h3 className="text-2xl font-black mb-8 tracking-tight">Did this help?</h3>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button 
                                        onClick={() => setFeedback('yes')}
                                        className="px-10 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 text-xs font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <FiSmile className="text-lg" /> Yes, thanks!
                                    </button>
                                    <button 
                                        onClick={() => setFeedback('no')}
                                        className="px-10 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 text-xs font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <FiFrown className="text-lg" /> Not really
                                    </button>
                                </div>
                            </motion.div>
                        ) : feedback === 'yes' ? (
                            <motion.div 
                                key="positive"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl mx-auto mb-6">
                                    <FiSmile />
                                </div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Thanks for your feedback!</h3>
                                <p className="text-slate-400 font-bold">We're glad we could help orchestration your workflow.</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="negative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-6">
                                    <FiFrown />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">We're sorry to hear that.</h3>
                                <p className="text-slate-400 font-bold mb-8 max-w-md mx-auto">Would you like to connect with our support engineering team for a personalized resolution?</p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <Link 
                                        href="/contact"
                                        className="px-8 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dark transition-all"
                                    >
                                        <FiMessageSquare /> Use Contact Page
                                    </Link>
                                    <a 
                                        href="mailto:admin@microcrm.io"
                                        className="px-8 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                    >
                                        <FiMail /> Send Direct Email
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <footer className="container py-12 border-t border-slate-50 dark:border-white/5 text-center px-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strata Documentation System . Reference: {category.toUpperCase()}</p>
            </footer>
        </main>
    );
}
