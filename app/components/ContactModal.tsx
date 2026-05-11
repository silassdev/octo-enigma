"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiTag, FiLoader } from "react-icons/fi";
import { Contact } from "@/lib/types";
import { saveContact } from "@/lib/actions";
import { toast } from "react-hot-toast";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Contact | null;
}

export default function ContactModal({ isOpen, onClose, onSuccess, initialData }: ContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "lead",
        tags: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                status: "lead",
                tags: [],
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveContact(formData);
            toast.success(initialData ? "Contact updated!" : "Contact added!");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to save contact");
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
                                {initialData ? "Edit Contact" : "New Contact"}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                                <FiX className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold placeholder:text-gray-400"
                                            placeholder="Jane Smith"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold placeholder:text-gray-400"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold placeholder:text-gray-400"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Company</label>
                                    <div className="relative">
                                        <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-bold placeholder:text-gray-400"
                                            placeholder="Company Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                                <div className="flex gap-3">
                                    {['lead', 'client', 'archived'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: s as any })}
                                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                formData.status === s 
                                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <FiLoader className="animate-spin" /> : initialData ? "Update Contact" : "Create Contact"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
