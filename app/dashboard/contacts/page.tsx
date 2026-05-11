"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiMoreVertical, FiEdit2, FiTrash2, FiMail, FiPhone, FiFilter, FiLoader, FiUser } from "react-icons/fi";
import { getContacts } from "@/lib/actions";
import { Contact } from "@/lib/types";
import ContactModal from "@/app/components/ContactModal";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<'all' | 'lead' | 'client' | 'archived'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const fetchContacts = async () => {
        setLoading(true);
        const data = await getContacts();
        setContacts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.email.toLowerCase().includes(search.toLowerCase()) ||
                            c.company?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || c.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };

    if (loading && contacts.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Contacts</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Manage your relationships and leads.</p>
                </div>
                <button 
                    onClick={handleNew}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 hover:bg-brand-dark transition-all"
                >
                    <FiPlus /> Add Contact
                </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative flex-1 w-full">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search contacts, emails, or companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary/10 transition-all text-slate-900 dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <FiFilter className="text-gray-400 ml-2 hidden md:block" />
                    {['all', 'lead', 'client', 'archived'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                filter === f 
                                ? "bg-brand-primary text-white" 
                                : "bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contacts Content */}
            {filteredContacts.length > 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contact</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Company</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContacts.map((contact, i) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={contact.id} 
                                        className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-brand-primary/10">
                                                    {contact.name[0]}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{contact.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-gray-500">{contact.company || "—"}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                contact.status === 'client' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                contact.status === 'lead' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                "bg-gray-50 text-gray-400 border-gray-100"
                                            )}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-brand-primary transition-colors">
                                                <FiMail className="text-[10px]" /> {contact.email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => handleEdit(contact)}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-brand-primary transition-all active:scale-95"
                                            >
                                                <FiEdit2 />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-16 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary text-3xl font-bold">
                        <FiUser />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No contacts found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto font-bold leading-relaxed">
                        {search || filter !== 'all' 
                            ? "No contacts match your current filters. Try adjusting your search." 
                            : "Add your first contact to start managing your leads and client relationships."}
                    </p>
                    <button 
                        onClick={handleNew}
                        className="px-8 py-4 rounded-2xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:opacity-90 transition-all"
                    >
                        Add New Contact
                    </button>
                </div>
            )}

            <ContactModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchContacts}
                initialData={editingContact}
            />
        </div>
    );
}
