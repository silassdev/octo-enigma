"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FiArrowLeft, FiLoader, FiShare2, FiDownload, FiCheckCircle, FiCopy } from 'react-icons/fi';
import Link from 'next/link';
import { Invoice } from '@/lib/types';
import toast from 'react-hot-toast';

export default function InvoicePage() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            const docRef = doc(db, "invoices", id as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setInvoice({ id: docSnap.id, ...docSnap.data() } as Invoice);
            }
            setLoading(false);
        };
        fetchInvoice();
    }, [id]);

    const handleCopyLink = () => {
        const url = `${window.location.origin}/portal/invoice/${id}`;
        navigator.clipboard.writeText(url);
        toast.success("Public link copied to clipboard!");
    };

    const handleMarkAsPaid = async () => {
        if (!invoice) return;
        try {
            await updateDoc(doc(db, "invoices", invoice.id), { status: 'paid' });
            setInvoice({ ...invoice, status: 'paid' });
            toast.success("Invoice marked as paid!");
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
        return <div className="text-center py-20 font-bold text-gray-500">Invoice not found</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/invoices" className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:text-brand-primary transition-all">
                        <FiArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Invoice #{invoice.id.slice(0, 5)}</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">Manage payment and client access</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleCopyLink}
                        className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 text-sm font-bold flex items-center gap-2 hover:border-brand-primary transition-all"
                    >
                        <FiCopy /> Copy Public Link
                    </button>
                    {invoice.status !== 'paid' && (
                        <button 
                            onClick={handleMarkAsPaid}
                            className="px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center gap-2"
                        >
                            <FiCheckCircle /> Mark as Paid
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-gray-800 shadow-sm space-y-12">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Billed To</h3>
                                <p className="font-bold text-lg">Client Name Placeholder</p>
                                <p className="text-sm text-gray-500">client@example.com</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Status</h3>
                                <span className={clsx(
                                    "px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider",
                                    invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                )}>
                                    {invoice.status}
                                </span>
                            </div>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-gray-800">
                                    <th className="pb-4">Description</th>
                                    <th className="pb-4 text-center">Qty</th>
                                    <th className="pb-4 text-right">Price</th>
                                    <th className="pb-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {invoice.items.map((item, i) => (
                                    <tr key={i}>
                                        <td className="py-6 font-bold">{item.description}</td>
                                        <td className="py-6 text-center font-bold text-gray-500">{item.quantity}</td>
                                        <td className="py-6 text-right font-bold text-gray-500">{invoice.currency}{item.price.toLocaleString()}</td>
                                        <td className="py-6 text-right font-bold">{invoice.currency}{(item.quantity * item.price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end pt-8">
                            <div className="w-64 space-y-4 text-right">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest">Subtotal</span>
                                    <span>{invoice.currency}{invoice.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest">Tax</span>
                                    <span>{invoice.currency}{invoice.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black pt-4 border-t border-gray-100 dark:border-gray-800 text-brand-primary">
                                    <span>Total</span>
                                    <span>{invoice.currency}{invoice.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-black mb-6">Payment History</h3>
                        <div className="space-y-4">
                            {invoice.status === 'paid' ? (
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
                                    <FiCheckCircle className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm font-bold">Payment Received</p>
                                        <p className="text-[10px] uppercase font-black tracking-widest">Confirmed via Portal</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm font-bold text-gray-500 text-center py-4 italic">No payments recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function clsx(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
