"use client";

import React, { useState, useEffect } from "react";
import { 
    FiPlus, 
    FiFileText, 
    FiLoader, 
    FiMessageSquare, 
    FiCheckCircle, 
    FiClock, 
    FiAlertCircle,
    FiX
} from "react-icons/fi";
import { getTickets, saveTicket } from "@/lib/actions";
import { Ticket } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/components/AuthProvider";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";

export default function SupportPage() {
    const { user, loading: authLoading } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "medium" as any });
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        if (authLoading || !user) return;
        setLoading(true);
        const data = await getTickets();
        setTickets(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, [user, authLoading]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await saveTicket(newTicket);
            toast.success("Ticket created! We'll be in touch soon.");
            setIsModalOpen(false);
            setNewTicket({ subject: "", description: "", priority: "medium" });
            fetchTickets();
        } catch (error) {
            toast.error("Failed to create ticket");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Support Center <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Pro priority support and technical assistance</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center gap-2"
                >
                    <FiPlus /> Create Ticket
                </button>
            </div>

            {/* Tickets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.length > 0 ? (
                    tickets.map((ticket, i) => (
                        <div key={ticket.id} className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 hover:border-brand-primary/20 transition-all duration-500 relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className={clsx(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                    ticket.status === 'open' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                                    ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                    'bg-gray-50 text-gray-400 border-gray-100'
                                )}>
                                    {ticket.status}
                                </div>
                                <div className={clsx(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                    ticket.priority === 'high' ? 'bg-red-50 text-red-500 border-red-100' :
                                    ticket.priority === 'medium' ? 'bg-orange-50 text-orange-500 border-orange-100' :
                                    'bg-slate-50 text-slate-400 border-slate-100'
                                )}>
                                    {ticket.priority} priority
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight line-clamp-1">{ticket.subject}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold line-clamp-2 mb-6 leading-relaxed">
                                {ticket.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <FiClock /> {new Date(ticket.createdAt).toLocaleDateString()}
                                </div>
                                <button className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-400 group-hover:text-brand-primary transition-colors">
                                    <FiMessageSquare />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                        <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No active support tickets. We're here if you need us!</p>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 w-full max-w-xl relative z-10 shadow-2xl border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">New Support Request</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-400"><FiX /></button>
                            </div>
                            
                            <form onSubmit={handleCreateTicket} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Brief summary of the issue..."
                                        value={newTicket.subject}
                                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="Detailed explanation of what's happening..."
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Urgency</label>
                                    <div className="flex gap-2 p-1 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                        {(['low', 'medium', 'high'] as const).map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setNewTicket({...newTicket, priority: p})}
                                                className={clsx(
                                                    "flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                    newTicket.priority === p 
                                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                                                        : "text-gray-400 hover:text-slate-900 dark:hover:text-white"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full py-4 rounded-2xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <FiLoader className="animate-spin" /> : <FiPlus />} {submitting ? 'Sending...' : 'Submit Priority Ticket'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

