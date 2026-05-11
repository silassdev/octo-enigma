"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiMail, 
    FiMessageSquare, 
    FiCheckCircle, 
    FiClock, 
    FiSearch, 
    FiFilter, 
    FiChevronRight, 
    FiUser,
    FiInbox,
    FiX,
    FiArrowRight,
    FiLoader,
    FiExternalLink
} from "react-icons/fi";
import { getContactRequests, updateContactRequestStatus } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";

const formatDate = (dateString: string, type: 'short' | 'long' = 'short') => {
    const date = new Date(dateString);
    if (type === 'long') {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        const data = await getContactRequests();
        setTickets(data);
        setLoading(false);
    };

    const handleStatusToggle = async (ticket: any) => {
        const newStatus = ticket.status === 'open' ? 'resolved' : 'open';
        const toastId = toast.loading(`Updating status to ${newStatus}...`);
        try {
            await updateContactRequestStatus(ticket.id, newStatus);
            toast.success(`Ticket marked as ${newStatus}`, { id: toastId });
            setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: newStatus } : t));
            if (selectedTicket?.id === ticket.id) {
                setSelectedTicket({ ...selectedTicket, status: newStatus });
            }
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = 
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || t.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header Stratum */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-slate-900 text-white p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px]" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                        <FiInbox /> Centralized Support Forensics
                    </div>
                    <h1 className="text-5xl font-black mb-4 tracking-tighter">Support Tickets</h1>
                    <p className="text-slate-400 font-bold max-w-md">Orchestrate resolutions and manage platform-wide inquiries with forensic precision.</p>
                </div>
                <div className="relative z-10 flex gap-4">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Open</p>
                        <p className="text-3xl font-black">{tickets.filter(t => t.status === 'open').length}</p>
                    </div>
                    <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 text-center min-w-[120px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-2">Resolved</p>
                        <p className="text-3xl font-black text-emerald-500">{tickets.filter(t => t.status === 'resolved').length}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Discovery Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    {['all', 'open', 'resolved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={clsx(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f 
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10" 
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 max-w-md sm:min-w-[300px]">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search inquiries, names or emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-bold text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Ticket Stream */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10 text-slate-400">
                        <FiLoader className="w-12 h-12 animate-spin text-brand-primary" />
                        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Retrieving Support Stream...</p>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-32 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                        <FiInbox className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                        <h3 className="text-xl font-black mb-2">No Inquiries Found</h3>
                        <p className="text-slate-400 font-bold">The support stream is currently empty for this filter.</p>
                    </div>
                ) : (
                    filteredTickets.map((ticket, idx) => (
                        <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer"
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6 flex-1 w-full md:w-auto">
                                    <div className={clsx(
                                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl shrink-0 shadow-inner",
                                        ticket.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" : "bg-brand-primary/10 text-brand-primary"
                                    )}>
                                        {ticket.status === 'resolved' ? <FiCheckCircle /> : <FiClock className="animate-pulse" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-black mb-1 truncate tracking-tight">{ticket.subject}</h3>
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1.5"><FiUser className="text-slate-300" /> {ticket.name}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="flex items-center gap-1.5 lowercase"><FiMail className="text-slate-300" /> {ticket.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-6 md:pt-0">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Received</p>
                                        <p className="text-xs font-black">{formatDate(ticket.createdAt, 'short')}</p>
                                    </div>
                                    <FiChevronRight className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-2 transition-all text-2xl hidden md:block" />
                                    <button 
                                        className="md:hidden px-6 py-3 rounded-xl bg-slate-50 dark:bg-white/5 font-black text-[10px] uppercase tracking-widest"
                                        onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                                    >
                                        View Detail
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Ticket Detail Portal (Modal) */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10 no-print"
                        >
                            <div className="p-12">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex items-center gap-6">
                                        <div className={clsx(
                                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl",
                                            selectedTicket.status === 'resolved' ? "bg-emerald-500 text-white" : "bg-brand-primary text-white"
                                        )}>
                                            {selectedTicket.status === 'resolved' ? <FiCheckCircle /> : <FiInbox />}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tighter mb-2">{selectedTicket.subject}</h2>
                                            <div className="flex items-center gap-3">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    selectedTicket.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" : "bg-brand-primary/10 text-brand-primary"
                                                )}>
                                                    {selectedTicket.status}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(selectedTicket.createdAt, 'long')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedTicket(null)}
                                        className="p-4 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                                    >
                                        <FiX />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Requester Identity</p>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-white/5"><FiUser /></div>
                                                <span className="font-black truncate">{selectedTicket.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-white/5"><FiMail /></div>
                                                <span className="font-black truncate lowercase">{selectedTicket.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex flex-col justify-center items-center gap-4 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Actions</p>
                                        <button 
                                            onClick={() => handleStatusToggle(selectedTicket)}
                                            className={clsx(
                                                "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl",
                                                selectedTicket.status === 'resolved'
                                                    ? "bg-slate-200 dark:bg-slate-800 text-slate-500"
                                                    : "bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-[1.02]"
                                            )}
                                        >
                                            {selectedTicket.status === 'resolved' ? "Re-open Inquiry" : "Mark Resolved"}
                                        </button>
                                        <a 
                                            href={`mailto:${selectedTicket.email}`}
                                            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90"
                                        >
                                            <FiMail /> Reply via Email
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Inquiry Message</p>
                                    <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/5 relative">
                                        <FiMessageSquare className="absolute -top-3 -left-3 text-brand-primary text-4xl opacity-10" />
                                        <p className="text-lg font-bold text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {selectedTicket.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
