"use client";

import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiPrinter, FiMail, FiDownload, FiCheckCircle, FiLoader, FiClock } from "react-icons/fi";
import { getInvoices, saveInvoice } from "@/lib/actions";
import { Invoice } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import InvoiceStatusBadge from "@/app/components/InvoiceStatusBadge";
import { toast } from "react-hot-toast";

export default function InvoiceDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<(Invoice & { contactName?: string }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            const data = await getInvoices();
            const inv = data.find(i => i.id === id);
            setInvoice(inv as (Invoice & { contactName?: string }) || null);
            setLoading(false);
        };
        fetchInvoice();
    }, [id]);

    const handleMarkAsPaid = async () => {
        if (!invoice) return;
        try {
            await saveInvoice({ id: invoice.id, status: 'paid' });
            toast.success("Invoice marked as paid!");
            setInvoice({ ...invoice, status: 'paid' });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="text-center py-20">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Invoice not found</h3>
                <button onClick={() => router.back()} className="mt-4 text-brand-primary font-bold flex items-center gap-2 mx-auto">
                    <FiArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 font-bold hover:text-slate-900 transition-colors">
                    <FiArrowLeft /> Back to List
                </button>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <FiPrinter /> Print
                    </button>
                    {invoice.status !== 'paid' && (
                        <button 
                            onClick={handleMarkAsPaid}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                        >
                            <FiCheckCircle /> Mark as Paid
                        </button>
                    )}
                </div>
            </div>

            {/* Invoice Paper */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-50 dark:border-gray-800 overflow-hidden print:shadow-none print:border-none">
                {/* Invoice Header/Banner */}
                <div className="p-12 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Invoice Number</h2>
                        <h1 className="text-3xl font-black tracking-tighter">#{invoice.id.slice(0, 8).toUpperCase()}</h1>
                    </div>
                    <div className="text-right">
                        <InvoiceStatusBadge status={invoice.status} className="!text-xs py-2 px-4 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Created Date</p>
                        <p className="font-bold">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="p-16 space-y-16">
                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-20">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">From</h3>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-slate-900 dark:text-white">Your Business Name</p>
                                <p className="text-sm font-bold text-gray-500">Professional Freelancer</p>
                                <p className="text-sm font-bold text-gray-500">yourname@example.com</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Bill To</h3>
                            <div className="space-y-1 text-right">
                                <p className="text-xl font-black text-slate-900 dark:text-white">{invoice.contactName}</p>
                                <p className="text-sm font-bold text-gray-400">Contact ID: {invoice.contactId.slice(0, 8)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="space-y-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-100 dark:border-gray-800">
                                    <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                                    <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Qty</th>
                                    <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Unit Price</th>
                                    <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {invoice.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-8">
                                            <p className="font-black text-slate-900 dark:text-white">{item.title}</p>
                                        </td>
                                        <td className="py-8 text-center font-bold text-gray-500">{item.quantity}</td>
                                        <td className="py-8 text-right font-bold text-gray-500">${item.price.toLocaleString()}</td>
                                        <td className="py-8 text-right font-black text-slate-900 dark:text-white">${item.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Summary */}
                    <div className="flex justify-end border-t-2 border-gray-100 dark:border-gray-800 pt-12">
                        <div className="w-full max-w-xs space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                <span className="font-black text-slate-900 dark:text-white">${invoice.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-400 uppercase tracking-widest">Tax (15%)</span>
                                <span className="font-black text-slate-900 dark:text-white">${invoice.tax.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-widest">Total Due</span>
                                <span className="text-3xl font-black text-brand-primary">${invoice.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="pt-20 border-t border-gray-50 dark:border-gray-800">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Terms & Conditions</h4>
                        <p className="text-sm text-gray-400 font-bold leading-relaxed max-w-2xl">
                            Please pay this invoice within {new Date(invoice.dueDate).toLocaleDateString()} to avoid late fees. 
                            If you have any questions, please contact billing@yourbusiness.com. Thank you for your business!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
