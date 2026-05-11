"use client";

import React, { useState, useEffect } from "react";
import { 
    FiFileText, 
    FiLoader, 
    FiMessageSquare, 
    FiCheckCircle, 
    FiClock, 
    FiAlertCircle,
    FiFilter,
    FiActivity
} from "react-icons/fi";
import { getAdminTickets, updateTicketStatus } from "@/lib/actions";
import { Ticket } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/components/AuthProvider";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";

export default function AdminTicketsPage() {
    const { user, loading: authLoading } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchTickets = async () => {
        if (authLoading || !user) return;
        setLoading(true);
        const data = await getAdminTickets();
        setTickets(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, [user, authLoading]);

    const handleStatusUpdate = async (id: string, status: Ticket['status']) => {
        try {
            await updateTicketStatus(id, status);
            toast.success(`Ticket marked as ${status}`);
            fetchTickets();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredTickets = tickets.filter(t => filterStatus === "all" || t.status === filterStatus);

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
                        Global Tickets <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Platform-wide support request management</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    {['all', 'open', 'in-progress', 'resolved'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={clsx(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filterStatus === s 
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                                    : "text-gray-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tickets Table/List */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-800">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subject / User</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Priority</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all">
                                    <td className="px-10 py-8">
                                        <div className="space-y-1">
                                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{ticket.subject}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {ticket.id.slice(0, 8)} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className={clsx(
                                            "inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            ticket.priority === 'high' ? "bg-red-50 text-red-500 border-red-100" :
                                            ticket.priority === 'medium' ? "bg-orange-50 text-orange-500 border-orange-100" :
                                            "bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800"
                                        )}>
                                            {ticket.priority}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx(
                                                "w-2 h-2 rounded-full",
                                                ticket.status === 'open' ? 'bg-blue-500 animate-pulse' :
                                                ticket.status === 'resolved' ? 'bg-emerald-500' :
                                                'bg-gray-400'
                                            )} />
                                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{ticket.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {ticket.status !== 'in-progress' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(ticket.id, 'in-progress')}
                                                    className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-brand-primary transition-all shadow-sm"
                                                    title="Mark as In Progress"
                                                >
                                                    <FiActivity />
                                                </button>
                                            )}
                                            {ticket.status !== 'resolved' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                                                    className="p-3 rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-500/10"
                                                    title="Resolve Ticket"
                                                >
                                                    <FiCheckCircle />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredTickets.length === 0 && (
                <div className="py-20 text-center bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                    <FiCheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">All clear! No tickets found matching this filter.</p>
                </div>
            )}
        </div>
    );
}

