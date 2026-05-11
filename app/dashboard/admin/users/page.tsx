"use client";

import React, { useState, useEffect } from "react";
import { 
    FiUsers, 
    FiMoreVertical, 
    FiSearch, 
    FiFilter, 
    FiArrowRight, 
    FiLoader,
    FiCheckCircle,
    FiUserPlus,
    FiExternalLink
} from "react-icons/fi";
import { getAllUsers } from "@/lib/actions";
import Link from "next/link";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/components/AuthProvider";

export default function AdminUsersPage() {
    const { user, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPlan, setFilterPlan] = useState("all");

    useEffect(() => {
        const fetchUsers = async () => {
            if (authLoading) return;
            if (!user) return;
            
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setLoading(false);
        };
        fetchUsers();
    }, [user, authLoading]);

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.name || u.displayName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterPlan === "all" || u.plan === filterPlan;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        User Directory <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Manage all {users.length} active platform accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all w-64 uppercase tracking-widest"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
                {['all', 'free', 'pro', 'lifetime'].map(plan => (
                    <button
                        key={plan}
                        onClick={() => setFilterPlan(plan)}
                        className={clsx(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                            filterPlan === plan 
                                ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" 
                                : "bg-white dark:bg-slate-900 text-gray-400 border-gray-100 dark:border-gray-800 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        {plan}
                    </button>
                ))}
            </div>

            {/* User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredUsers.map((u, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            key={u.id}
                        >
                            <Link 
                                href={`/dashboard/admin/users/${u.id}`}
                                className="group block bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 hover:border-brand-primary/20 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-xl font-black text-brand-primary shadow-inner">
                                        {(u.name || u.displayName || u.email || "?").charAt(0)}
                                    </div>
                                    <div className={clsx(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        u.plan === 'pro' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" :
                                        u.plan === 'lifetime' ? "bg-amber-100 text-amber-600 border-amber-200" :
                                        "bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                                    )}>
                                        {u.plan}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-brand-primary transition-colors tracking-tight">
                                        {u.name || u.displayName || "Untitled User"}
                                    </h3>
                                    <p className="text-gray-400 text-xs font-bold truncate mb-6">{u.email}</p>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Joined</p>
                                            <p className="text-xs font-black text-slate-900 dark:text-gray-400">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                            <FiArrowRight />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredUsers.length === 0 && (
                <div className="py-20 text-center bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                    <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No users found matching your search</p>
                </div>
            )}
        </div>
    );
}

