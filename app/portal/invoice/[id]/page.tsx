"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FiCheckCircle, FiDownload, FiCreditCard, FiLoader } from 'react-icons/fi';
import { Invoice } from '@/lib/types';

export default function PublicInvoicePortal() {
    const { id } = useParams();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <h1 className="text-2xl font-black mb-2">Invoice Not Found</h1>
                    <p className="text-gray-500">The requested invoice could not be located or has been expired.</p>
                </div>
            </div>
        );
    }

    const isPaid = invoice.status === 'paid';

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Branding */}
                <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                            <span className="font-black">M</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter">MicroCRM<span className="text-brand-primary">.</span></span>
                    </div>
                    {isPaid ? (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            <FiCheckCircle /> Paid
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm uppercase tracking-widest animate-pulse">
                            Awaiting Payment
                        </div>
                    )}
                </div>

                {/* Main Invoice Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">Invoice</h1>
                            <p className="text-gray-400 font-black tracking-widest text-xs uppercase mb-8">Ref: #{invoice.id.slice(0, 8)}</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Issue Date</p>
                                    <p className="font-bold">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Due Date</p>
                                    <p className="font-bold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex flex-col justify-end">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Amount Due</p>
                            <h2 className="text-6xl font-black text-brand-primary">{invoice.currency}{Number(invoice.total).toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 py-12">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="pb-6">Description</th>
                                    <th className="pb-6 text-center">Qty</th>
                                    <th className="pb-6 text-right">Price</th>
                                    <th className="pb-6 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {invoice.items.map((item, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-6 font-bold">{item.description}</td>
                                        <td className="py-6 text-center font-bold text-gray-500">{item.quantity}</td>
                                        <td className="py-6 text-right font-bold text-gray-500">{invoice.currency}{item.price.toLocaleString()}</td>
                                        <td className="py-6 text-right font-bold">{invoice.currency}{(item.quantity * item.price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end pt-12 border-t border-gray-100 dark:border-gray-800">
                        <div className="w-full md:w-64 space-y-4 text-right">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400 uppercase tracking-widest">Subtotal</span>
                                <span>{invoice.currency}{invoice.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400 uppercase tracking-widest">Tax (15%)</span>
                                <span>{invoice.currency}{invoice.tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black pt-4 border-t border-gray-100 dark:border-gray-800">
                                <span>Total</span>
                                <span className="text-brand-primary">{invoice.currency}{invoice.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Action Bar */}
                {!isPaid && (
                    <div className="sticky bottom-8 max-w-2xl mx-auto">
                        <div className="bg-slate-900 dark:bg-brand-primary rounded-[2rem] p-4 flex gap-4 shadow-2xl ring-4 ring-white/10 backdrop-blur-xl">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 py-4 px-8 rounded-2xl font-black hover:scale-[1.02] transition-all shadow-xl">
                                <FiCreditCard /> Pay Online Now
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-4 px-8 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20">
                                <FiDownload /> Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
