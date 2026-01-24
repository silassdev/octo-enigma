"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlus,
    FiFileText,
    FiSend,
    FiCheckCircle,
    FiClock,
    FiX,
    FiMoreVertical,
    FiDollarSign,
    FiTrash2,
    FiDownload
} from "react-icons/fi";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { useAuth } from "@/app/components/AuthProvider";
import { toast } from "react-hot-toast";
import { Invoice, Contact, Project, InvoiceItem } from "@/lib/types";

export default function InvoicesPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        contactId: "",
        projectId: "",
        dueDate: "",
        currency: "USD",
        items: [{ description: "", quantity: 1, price: 0 }] as InvoiceItem[],
        taxRate: 0
    });

    const fetchData = async () => {
        if (!user) return;
        try {
            // Fetch Invoices
            const iq = query(collection(db, "invoices"), where("ownerId", "==", user.uid));
            const iSnapshot = await getDocs(iq);
            const fetchedInvoices: Invoice[] = [];
            iSnapshot.forEach((doc) => {
                fetchedInvoices.push({ id: doc.id, ...doc.data() } as Invoice);
            });
            setInvoices(fetchedInvoices);

            // Fetch Contacts
            const cq = query(collection(db, "contacts"), where("ownerId", "==", user.uid));
            const cSnapshot = await getDocs(cq);
            const fetchedContacts: Contact[] = [];
            cSnapshot.forEach((doc) => {
                fetchedContacts.push({ id: doc.id, ...doc.data() } as Contact);
            });
            setContacts(fetchedContacts);

            // Fetch Projects
            const pq = query(collection(db, "projects"), where("ownerId", "==", user.uid));
            const pSnapshot = await getDocs(pq);
            const fetchedProjects: Project[] = [];
            pSnapshot.forEach((doc) => {
                fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
            });
            setProjects(fetchedProjects);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const calculateSubtotal = (items: InvoiceItem[]) => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: "", quantity: 1, price: 0 }]
        });
    };

    const removeItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const subtotal = calculateSubtotal(formData.items);
            const tax = subtotal * (formData.taxRate / 100);
            const total = subtotal + tax;

            const newInvoice = {
                ...formData,
                ownerId: user.uid,
                subtotal,
                tax,
                total,
                status: "draft" as const,
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, "invoices"), newInvoice);
            setInvoices([...invoices, { id: docRef.id, ...newInvoice } as Invoice]);
            setIsModalOpen(false);
            setFormData({
                contactId: "",
                projectId: "",
                dueDate: "",
                currency: "USD",
                items: [{ description: "", quantity: 1, price: 0 }],
                taxRate: 0
            });
            toast.success("Invoice created successfully!");
        } catch (error) {
            toast.error("Error creating invoice");
        }
    };

    const getContactName = (id: string) => {
        return contacts.find(c => c.id === id)?.name || "Unknown Client";
    };

    const statusStyles = {
        draft: "bg-gray-100 text-gray-600",
        sent: "bg-blue-50 text-blue-600",
        paid: "bg-emerald-50 text-emerald-600",
        overdue: "bg-red-50 text-red-600"
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Invoices</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Manage billing and payments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center gap-2"
                >
                    <FiPlus /> Create Invoice
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden text-slate-950 dark:text-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Invoice</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Client</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Amount</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold italic">Loading invoices...</td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold italic">No invoices found.</td>
                                </tr>
                            ) : (
                                invoices.map(invoice => (
                                    <tr key={invoice.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                                    <FiFileText />
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">INV-{invoice.id.slice(0, 4).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-600 dark:text-gray-400">
                                            {getContactName(invoice.contactId)}
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                            {invoice.currency} {invoice.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles[invoice.status]}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 font-bold">
                                            {new Date(invoice.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Create Invoice</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <form onSubmit={handleSubmit} className="p-6 space-y-6 text-slate-950 dark:text-gray-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Client</label>
                                            <select
                                                required
                                                value={formData.contactId}
                                                onChange={e => setFormData({ ...formData, contactId: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                            >
                                                <option value="">Select a client</option>
                                                {contacts.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Due Date</label>
                                            <input
                                                required
                                                type="date"
                                                value={formData.dueDate}
                                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Line Items</h4>
                                            <button
                                                type="button"
                                                onClick={addItem}
                                                className="text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1"
                                            >
                                                <FiPlus /> Add Item
                                            </button>
                                        </div>

                                        {formData.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-3 items-end">
                                                <div className="col-span-6">
                                                    <label className="text-[10px] font-black tracking-widest text-gray-400 mb-1 block">Description</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Service or product name"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] font-black tracking-widest text-gray-400 mb-1 block">Qty</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-[10px] font-black tracking-widest text-gray-400 mb-1 block">Price</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={formData.items.length === 1}
                                                        className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-0"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-2">
                                        <div className="flex justify-between text-sm font-bold text-gray-500">
                                            <span>Subtotal</span>
                                            <span>{formData.currency} {calculateSubtotal(formData.items).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                            <span>Tax Rate (%)</span>
                                            <input
                                                type="number"
                                                value={formData.taxRate}
                                                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                                                className="w-20 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 text-right font-bold text-sm"
                                            />
                                        </div>
                                        <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2">
                                            <span>Total</span>
                                            <span>{formData.currency} {(calculateSubtotal(formData.items) * (1 + formData.taxRate / 100)).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full py-4 rounded-xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
                                        >
                                            Save Invoice Draft
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
