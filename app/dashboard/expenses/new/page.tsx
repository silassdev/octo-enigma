"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiSave, FiArrowLeft, FiCamera, FiLoader, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function NewExpensePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [expenseData, setExpenseData] = useState({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'general',
        notes: '',
        receiptUrl: '',
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanning(true);
        const user = auth.currentUser;
        if (!user) return;

        try {
            // 1. Upload to Firebase Storage
            const storageRef = ref(storage, `receipts/${user.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            
            // 2. Mock OCR Scanning
            // In a real app, you'd send this URL or file to an OCR service (e.g., Tesseract.js, Google Vision, etc.)
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
            
            const mockOcrResult = {
                amount: Math.floor(Math.random() * 500) + 20.50, // Mock random amount
                date: new Date().toISOString().split('T')[0],
            };

            setExpenseData(prev => ({
                ...prev,
                receiptUrl: url,
                amount: mockOcrResult.amount,
                date: mockOcrResult.date,
            }));

            toast.success("Receipt scanned successfully! Details auto-populated.");
        } catch (error: any) {
            toast.error("Failed to scan receipt: " + error.message);
        } finally {
            setScanning(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;
        setLoading(true);

        try {
            await addDoc(collection(db, "expenses"), {
                ...expenseData,
                ownerId: user.uid,
                createdAt: new Date().toISOString()
            });

            toast.success("Expense recorded successfully!");
            router.push("/dashboard/expenses");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => router.back()} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:text-brand-primary transition-all">
                        <FiArrowLeft />
                    </button>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Record Expense</h1>
                </div>
                <button 
                    type="submit" 
                    disabled={loading || scanning}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                    {loading ? <FiLoader className="animate-spin" /> : <FiSave />} Save Expense
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all group overflow-hidden relative"
                    >
                        {expenseData.receiptUrl ? (
                            <>
                                <img src={expenseData.receiptUrl} alt="Receipt Preview" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <span className="text-white font-bold text-xs">Change Receipt</span>
                                </div>
                            </>
                        ) : (
                            <>
                                {scanning ? (
                                    <FiLoader className="w-10 h-10 animate-spin text-brand-primary mb-4" />
                                ) : (
                                    <FiCamera className="w-10 h-10 text-gray-300 mb-4 group-hover:text-brand-primary transition-all" />
                                )}
                                <p className="text-sm font-bold text-gray-400 group-hover:text-brand-primary transition-all">
                                    {scanning ? "Analyzing Receipt..." : "Snap or Upload Receipt"}
                                </p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-300 mt-2">Auto-fills amount & date</p>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Amount</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={expenseData.amount}
                                onChange={(e) => setExpenseData({ ...expenseData, amount: parseFloat(e.target.value) })}
                                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all text-xl font-black text-brand-primary"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Date</label>
                            <input 
                                type="date" 
                                value={expenseData.date}
                                onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Category</label>
                        <select 
                            value={expenseData.category}
                            onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all font-bold"
                        >
                            <option value="general">General Office</option>
                            <option value="travel">Travel & Meals</option>
                            <option value="software">Software & Subs</option>
                            <option value="hardware">Hardware & Equipment</option>
                            <option value="marketing">Marketing & Ads</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Notes</label>
                        <textarea 
                            value={expenseData.notes}
                            onChange={(e) => setExpenseData({ ...expenseData, notes: e.target.value })}
                            placeholder="What was this for?"
                            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-brand-primary transition-all min-h-[100px] resize-none"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
