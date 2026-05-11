"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLayout, FiUser, FiCalendar, FiDollarSign, FiLoader } from "react-icons/fi";
import { Project, Contact } from "@/lib/types";
import { saveProject, getContacts } from "@/lib/actions";
import { toast } from "react-hot-toast";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, onSuccess, initialData }: ProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [formData, setFormData] = useState<Partial<Project>>({
        title: "",
        contactId: "",
        description: "",
        status: "planning",
        budget: 0,
        dueDate: "",
    });

    useEffect(() => {
        if (isOpen) {
            const fetchContacts = async () => {
                const data = await getContacts();
                setContacts(data);
                if (data.length > 0 && !formData.contactId) {
                    setFormData(prev => ({ ...prev, contactId: data[0].id }));
                }
            };
            fetchContacts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: "",
                contactId: contacts[0]?.id || "",
                description: "",
                status: "planning",
                budget: 0,
                dueDate: "",
            });
        }
    }, [initialData, isOpen, contacts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.contactId) {
            toast.error("Please select a client/contact");
            return;
        }
        setLoading(true);
        try {
            await saveProject(formData);
            toast.success(initialData ? "Project updated!" : "Project created!");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to save project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                {initialData ? "Edit Project" : "New Project"}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                                <FiX className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Project Title</label>
                                <div className="relative">
                                    <FiLayout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold placeholder:text-gray-400"
                                        placeholder="Mobile App UI Redesign"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Client / Contact</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        required
                                        value={formData.contactId}
                                        onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a client</option>
                                        {contacts.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.company || 'No Company'})</option>
                                        ))}
                                    </select>
                                </div>
                                {contacts.length === 0 && (
                                    <p className="text-[10px] text-red-400 font-bold ml-1">No contacts found. Add a contact first!</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Budget</label>
                                    <div className="relative">
                                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold placeholder:text-gray-400"
                                            placeholder="2500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Due Date</label>
                                    <div className="relative">
                                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['planning', 'in-progress', 'completed', 'on-hold'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: s as any })}
                                            className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                formData.status === s 
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' 
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-transparent hover:bg-gray-100'
                                            }`}
                                        >
                                            {s.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || contacts.length === 0}
                                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : initialData ? "Update Project" : "Create Project"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
