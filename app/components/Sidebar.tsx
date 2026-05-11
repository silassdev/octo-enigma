"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiBriefcase, FiFileText, FiDollarSign, FiPieChart, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { toast } from "react-hot-toast";

const navItems = [
    { label: "Overview", href: "/dashboard", icon: <FiHome /> },
    { label: "Contacts", href: "/dashboard/contacts", icon: <FiUsers /> },
    { label: "Projects", href: "/dashboard/projects", icon: <FiBriefcase /> },
    { label: "Invoices", href: "/dashboard/invoices", icon: <FiFileText /> },
    { label: "Expenses", href: "/dashboard/expenses", icon: <FiDollarSign /> },
    { label: "Tax Prediction", href: "/dashboard/reports/tax", icon: <FiPieChart /> },
    { label: "Reports", href: "/dashboard/reports", icon: <FiPieChart /> },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { profile, user } = useAuth();

    const handleUpgrade = async () => {
        if (!user) return;
        const toastId = toast.loading("Preparing upgrade...");
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: "pro",
                    email: user.email,
                    userId: user.uid
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to start checkout", { id: toastId });
            }
        } catch (e) {
            toast.error("Something went wrong", { id: toastId });
        }
    };

    const NavContent = () => (
        <>
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group",
                                isActive
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <span className={clsx("text-lg", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600 transition-colors")}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
                {profile?.plan === 'free' && (
                    <div className="bg-gradient-to-br from-brand-primary/10 to-purple-500/10 p-4 rounded-2xl border border-brand-primary/20 mb-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Upgrade to Pro</h4>
                        <p className="text-[10px] font-bold text-gray-500 mb-4 tracking-tight">Unlock AI features and unlimited projects.</p>
                        <button 
                            onClick={handleUpgrade}
                            className="w-full py-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
                        >
                            Upgrade Now
                        </button>
                    </div>
                )}
                <Link
                    href="/dashboard/settings"
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                        pathname === "/dashboard/settings"
                            ? "bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    <FiSettings className="text-lg" />
                    Settings
                </Link>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-brand-primary text-white shadow-2xl shadow-brand-primary/40 md:hidden flex items-center justify-center"
            >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col z-40 pt-20">
                <NavContent />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] md:hidden"
                        />
                        <motion.aside 
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-950 z-50 flex flex-col md:hidden pt-8"
                        >
                            <div className="px-6 mb-8">
                                <h2 className="text-2xl font-black text-brand-primary">MicroCRM<span className="text-slate-900 dark:text-white">.</span></h2>
                            </div>
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
