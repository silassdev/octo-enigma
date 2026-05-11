"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiUser, FiCalendar, FiDollarSign, FiLayout, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { Project, Contact, Invoice, InvoiceItem } from "@/lib/types";
import { saveInvoice, getContacts, getProjects } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";

export default function InvoiceForm({ initialData }: { initialData?: Invoice | null }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    
    const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({
        contactId: "",
        projectId: "",
        items: [{ description: "", quantity: 1, price: 0, total: 0 }],
        subtotal: 0,
        tax: 0,
        total: 0,
        currency: "USD",
        status: "draft",
        dueDate: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const [c, p] = await Promise.all([getContacts(), getProjects()]);
            setContacts(c);
            setProjects(p);
        };
        fetchData();
        if (initialData) setInvoiceData(initialData);
    }, [initialData]);

    // Recalculate totals whenever items change
    useEffect(() => {
        const items = invoiceData.items || [];
        const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = subtotal * 0.15; // 15% placeholder tax
        const total = subtotal + tax;

        setInvoiceData(prev => ({
            ...prev,
            subtotal,
            tax,
            total
        }));
    }, [invoiceData.items]);

    const handleAddItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [...(invoiceData.items || []), { description: "", quantity: 1, price: 0, total: 0 }]
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...(invoiceData.items || [])];
        newItems.splice(index, 1);
        setInvoiceData({ ...invoiceData, items: newItems });
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...(invoiceData.items || [])];
        newItems[index] = { 
            ...newItems[index], 
            [field]: value,
            total: field === 'price' || field === 'quantity' 
                ? (field === 'price' ? value : newItems[index].price) * (field === 'quantity' ? value : newItems[index].quantity)
                : newItems[index].total
        };
        setInvoiceData({ ...invoiceData, items: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoiceData.contactId) return toast.error("Select a client");
        
        setLoading(true);
        try {
            await saveInvoice(invoiceData);
            toast.success("Invoice saved!");
            router.push("/dashboard/invoices");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-40">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        {initialData ? "Edit Invoice" : "New Invoice"}
                    </h1>
                    <p className="text-gray-400 font-bold text-sm">Professional billing for your creative work.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 rounded-xl bg-brand-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center gap-2"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <><FiCheck /> Save Invoice</>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: General Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-slate-200/20">
                        <div className="mb-10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                <FiUser className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Billing Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Client (Recipient)</label>
                                <select 
                                    required
                                    value={invoiceData.contactId}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, contactId: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold appearance-none cursor-pointer"
                                >
                                    <option value="">Select a client...</option>
                                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.company && `(${c.company})`}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Related Project (Optional)</label>
                                <select 
                                    value={invoiceData.projectId}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, projectId: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold appearance-none cursor-pointer"
                                >
                                    <option value="">No linked project</option>
                                    {projects.filter(p => !invoiceData.contactId || p.contactId === invoiceData.contactId).map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Due Date</label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="date"
                                        required
                                        value={invoiceData.dueDate}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Status</label>
                                <div className="flex gap-2">
                                    {['draft', 'sent', 'paid'].map(s => (
                                        <button 
                                            key={s}
                                            type="button"
                                            onClick={() => setInvoiceData({ ...invoiceData, status: s as any })}
                                            className={clsx(
                                                "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                invoiceData.status === s 
                                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:bg-gray-200'
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="mb-10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                    <FiLayout className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Line Items</h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleAddItem}
                                className="px-4 py-2 bg-brand-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                            >
                                <FiPlus /> Add Item
                            </button>
                        </div>

                        <div className="space-y-6">
                            {invoiceData.items?.map((item, index) => (
                                <div key={index} className="flex gap-4 items-end group">
                                    <div className="flex-[2] space-y-2">
                                        {index === 0 && <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>}
                                        <input 
                                            placeholder="Service or Product name"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description' as any, e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {index === 0 && <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Qty</label>}
                                        <input 
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {index === 0 && <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price</label>}
                                        <input 
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                            className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-none ring-1 ring-gray-100 dark:ring-gray-700 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="w-24 text-right mb-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                                        <p className="font-black text-slate-900 dark:text-white">${(item.quantity * item.price).toLocaleString()}</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveItem(index)}
                                        className="p-4 mb-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="space-y-8">
                    <div className="bg-slate-900 dark:bg-white p-10 rounded-[2.5rem] text-white dark:text-slate-900 shadow-2xl sticky top-8">
                        <h3 className="text-xl font-black mb-8 uppercase tracking-widest">Summary</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center opacity-60">
                                <span className="text-xs font-bold">Subtotal</span>
                                <span className="font-black">${invoiceData.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center opacity-60">
                                <span className="text-xs font-bold">Tax (15% VAT)</span>
                                <span className="font-black">${invoiceData.tax?.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/10 dark:bg-slate-200"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
                                <span className="text-2xl font-black">${invoiceData.total?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-white/5 dark:bg-slate-50 rounded-2xl flex items-center gap-4">
                            <FiDollarSign className="text-emerald-400 w-6 h-6" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Currency</p>
                                <p className="text-sm font-black">United States Dollar (USD)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
