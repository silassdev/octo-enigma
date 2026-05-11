"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiMoreVertical, FiFileText, FiDownload, FiTrash2, FiExternalLink, FiLoader } from "react-icons/fi";
import { getInvoices } from "@/lib/actions";
import { Invoice } from "@/lib/types";
import InvoiceStatusBadge from "@/app/components/InvoiceStatusBadge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function InvoicesPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<(Invoice & { contactName?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInvoices = async () => {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data as (Invoice & { contactName?: string })[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter(inv => 
        inv.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && invoices.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Invoices</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Track payments and manage your receivables.</p>
                </div>
                <Link 
                    href="/dashboard/invoices/new"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 hover:bg-brand-dark transition-all"
                >
                    <FiPlus /> Create Invoice
                </Link>
            </div>

            {/* Stats Overview */}
            {invoices.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Outstanding</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            ${invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + (i.total || 0), 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-emerald-500 p-8 rounded-[2rem] shadow-xl shadow-emerald-500/20 text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Total Paid</p>
                        <p className="text-3xl font-black">
                            ${invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (i.total || 0), 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Draft Invoices</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {invoices.filter(i => i.status === 'draft').length}
                        </p>
                    </div>
                </div>
            )}

            {/* Table section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search by client or invoice #..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                {filteredInvoices.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Invoice</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Due Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filteredInvoices.map((invoice, i) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={invoice.id} 
                                        className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                                    <FiFileText className="w-5 h-5" />
                                                </div>
                                                <span className="font-black text-slate-900 dark:text-white">#{invoice.id.slice(0, 8).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white">{invoice.contactName}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Client ID: {invoice.contactId.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-slate-900 dark:text-white text-lg">${invoice.total?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <InvoiceStatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-gray-500">
                                            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'TBD'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link 
                                                    href={`/dashboard/invoices/${invoice.id}`}
                                                    className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-brand-primary dark:hover:bg-brand-primary hover:text-white transition-all shadow-lg"
                                                >
                                                    <FiExternalLink />
                                                </Link>
                                                <button className="p-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-500 text-3xl font-black">
                            $
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No invoices found</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">Start by creating your first professional invoice.</p>
                        <Link 
                            href="/dashboard/invoices/new"
                            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 inline-flex items-center gap-2"
                        >
                            <FiPlus /> New Invoice
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
