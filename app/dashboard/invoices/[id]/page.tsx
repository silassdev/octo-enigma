"use client";

import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiPrinter, FiMail, FiDownload, FiCheckCircle, FiLoader, FiClock } from "react-icons/fi";
import { getInvoices, saveInvoice } from "@/lib/actions";
import { Invoice } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import InvoiceStatusBadge from "@/app/components/InvoiceStatusBadge";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/components/AuthProvider";

export default function InvoiceDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { profile } = useAuth();
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
        <div id="invoice-root" className="max-w-4xl mx-auto space-y-8 pb-20 print:m-0 print:p-0 print:max-w-none relative scroll-mt-20">
            <style jsx global>{`
                @media print {
                    /* Hide EVERYTHING except our specific invoice container */
                    aside, .no-print, nav, [role="complementary"], header { 
                        display: none !important; 
                    }
                    
                    /* Reset dashboard layout constraints */
                    main { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        position: static !important; 
                        display: block !important;
                    }
                    
                    .max-w-7xl, .pt-20 { 
                        padding-top: 0 !important; 
                        max-width: none !important; 
                        margin: 0 !important; 
                    }
                    
                    body { 
                        background: white !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                    }

                    .invoice-paper { 
                        box-shadow: none !important; 
                        border: none !important; 
                        margin: 0 !important; 
                        border-radius: 0 !important; 
                        width: 100% !important;
                    }
                    
                    .watermark { opacity: 0.05 !important; }
                }
            `}</style>

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
            <div className="invoice-paper bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-50 dark:border-gray-800 overflow-hidden relative min-h-[1000px]">
                {/* Watermark for Free Tier */}
                {profile?.plan === 'free' && (
                    <div className="watermark absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] overflow-hidden select-none z-0">
                        <p className="text-[12rem] font-black uppercase tracking-widest -rotate-45 whitespace-nowrap">
                            FREE TIER • MICROCRM
                        </p>
                    </div>
                )}

                {/* Invoice Header/Banner */}
                <div className="p-12 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-start relative z-10">
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

                <div className="p-16 space-y-16 relative z-10">
                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-20">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">From</h3>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-slate-900 dark:text-white">{profile?.displayName || "Your Business"}</p>
                                <p className="text-sm font-bold text-gray-500">Professional {profile?.plan || 'free'} member</p>
                                <p className="text-sm font-bold text-gray-500">{profile?.email}</p>
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
                                {invoice.items?.map((item: any, index) => (
                                    <tr key={index}>
                                        <td className="py-8">
                                            <p className="font-black text-slate-900 dark:text-white">{item.description || item.title || "No description"}</p>
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
                                <span className="font-black text-slate-900 dark:text-white">${invoice.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-400 uppercase tracking-widest">Tax (15%)</span>
                                <span className="font-black text-slate-900 dark:text-white">${invoice.tax?.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-widest">Total Due</span>
                                <span className="text-3xl font-black text-brand-primary">${invoice.total?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="pt-20 border-t border-gray-50 dark:border-gray-800">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Terms & Conditions</h4>
                        <p className="text-sm text-gray-400 font-bold leading-relaxed max-w-2xl">
                            Please pay this invoice within {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'TBD'} to avoid late fees. 
                            If you have any questions, please contact billing@{profile?.email?.split('@')[1] || 'yourbusiness.com'}. Thank you for your business!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
