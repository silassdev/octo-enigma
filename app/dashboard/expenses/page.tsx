"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlus,
    FiSearch,
    FiDollarSign,
    FiCalendar,
    FiImage,
    FiX,
    FiMoreVertical,
    FiCamera,
    FiTag
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
import { Expense, Contact, Project } from "@/lib/types";

export default function ExpensesPage() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: "Software",
        notes: "",
        contactId: "",
        projectId: ""
    });

    const categories = ["Software", "Marketing", "Travel", "Office", "Salaries", "Taxes", "Other"];

    const fetchData = async () => {
        if (!user) return;
        try {
            // Fetch Expenses
            const eq = query(collection(db, "expenses"), where("ownerId", "==", user.uid));
            const eSnapshot = await getDocs(eq);
            const fetchedExpenses: Expense[] = [];
            eSnapshot.forEach((doc) => {
                fetchedExpenses.push({ id: doc.id, ...doc.data() } as Expense);
            });
            setExpenses(fetchedExpenses);

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
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const newExpense = {
                ...formData,
                amount: Number(formData.amount),
                ownerId: user.uid,
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, "expenses"), newExpense);
            setExpenses([...expenses, { id: docRef.id, ...newExpense } as Expense]);
            setIsModalOpen(false);
            setFormData({ amount: 0, date: new Date().toISOString().split('T')[0], category: "Software", notes: "", contactId: "", projectId: "" });
            toast.success("Expense logged successfully!");
        } catch (error) {
            toast.error("Error logging expense");
        }
    };

    const getProjectName = (id: string) => {
        return projects.find(p => p.id === id)?.title || "General";
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Expenses</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Track your business spending and snapshots receipts.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center gap-2"
                >
                    <FiPlus /> Log Expense
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden text-slate-950 dark:text-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Expense</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Category</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Date</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-bold italic">Loading expenses...</td>
                                        </tr>
                                    ) : expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-bold italic">No expenses logged.</td>
                                        </tr>
                                    ) : (
                                        expenses.map(expense => (
                                            <tr key={expense.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{expense.notes || "No description"}</p>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{getProjectName(expense.projectId || "")}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-bold">
                                                    {new Date(expense.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-black text-slate-900 dark:text-white">${expense.amount.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-xl font-black mb-6">Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                                <span className="text-sm font-bold text-gray-500">This Month</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white">
                                    ${expenses.reduce((acc, exp) => acc + exp.amount, 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                                <span className="text-sm font-bold text-gray-500">Avg. Per Expense</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white">
                                    ${expenses.length > 0 ? (expenses.reduce((acc, exp) => acc + exp.amount, 0) / expenses.length).toFixed(2) : "0"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="w-full h-40 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Chart Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Log Expense Modal */}
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
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Log New Expense</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400"
                                >
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-950 dark:text-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Amount</label>
                                        <div className="relative">
                                            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Project (Optional)</label>
                                        <select
                                            value={formData.projectId}
                                            onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        >
                                            <option value="">None</option>
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id}>{p.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Notes / Description</label>
                                    <input
                                        type="text"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="e.g. AWS Monthly Bill"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                    />
                                </div>

                                <div className="pt-2">
                                    <div className="p-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-gray-400 group hover:border-brand-primary hover:text-brand-primary transition-all cursor-pointer">
                                        <FiCamera size={32} className="mb-2" />
                                        <p className="text-xs font-black uppercase tracking-widest">Snapshot Receipt</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
                                    >
                                        Save Expense
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
