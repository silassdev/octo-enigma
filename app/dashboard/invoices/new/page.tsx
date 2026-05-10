"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { FiPlus, FiTrash2, FiSave, FiArrowLeft, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

function NewInvoiceForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = searchParams.get('projectId');
    
    const [loading, setLoading] = useState(false);
    const [prefilling, setPrefilling] = useState(!!projectId);
    
    const [invoiceData, setInvoiceData] = useState({
        items: [{ description: '', quantity: 1, price: 0 }],
        status: 'draft',
        dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
        projectId: projectId || '',
    });

    useEffect(() => {
        if (projectId) {
            const prefill = async () => {
                const docRef = doc(db, "projects", projectId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setInvoiceData(prev => ({
                        ...prev,
                        items: [{ description: `Service for project: ${data.title}`, quantity: 1, price: data.budget || 0 }]
                    }));
                }
                setPrefilling(false);
            };
            prefill();
        }
    }, [projectId]);

    const handleAddItem = () => {
        setInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, price: 0 }]
        }));
    };

    const handleRemoveItem = (index: number) => {
        setInvoiceData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...invoiceData.items];
        (newItems[index] as any)[field] = value;
        setInvoiceData(prev => ({ ...prev, items: newItems }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;
        setLoading(true);

        const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const tax = subtotal * 0.15; // Example tax rate

        try {
            await addDoc(collection(db, "invoices"), {
                ...invoiceData,
                ownerId: user.uid,
                subtotal,
                tax,
                total: subtotal + tax,
                currency: 'USD',
                createdAt: new Date().toISOString()
            });

            toast.success("Invoice generated successfully!");
            router.push("/dashboard/invoices");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (prefilling) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <FiLoader className="w-6 h-6 animate-spin text-brand-primary mr-2" />
                <span className="font-bold text-gray-400">Prefilling project data...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => router.back()} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:text-brand-primary transition-all">
                        <FiArrowLeft />
                    </button>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">New Invoice</h1>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                    {loading ? <FiLoader className="animate-spin" /> : <FiSave />} Save Invoice
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold mb-2">Due Date</label>
                        <input 
                            type="date" 
                            value={invoiceData.dueDate}
                            onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-black">Line Items</h3>
                    {invoiceData.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                />
                            </div>
                            <div className="w-24">
                                <input 
                                    type="number" 
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all text-center"
                                />
                            </div>
                            <div className="w-32">
                                <input 
                                    type="number" 
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all text-right"
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => handleRemoveItem(index)}
                                className="p-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={handleAddItem}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-gray-400 font-bold hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2"
                    >
                        <FiPlus /> Add Another Item
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function NewInvoicePage() {
    return (
        <Suspense fallback={<FiLoader className="animate-spin" />}>
            <NewInvoiceForm />
        </Suspense>
    );
}
