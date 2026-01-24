"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiMoreVertical,
    FiMail,
    FiPhone,
    FiTag,
    FiX,
    FiCheck
} from "react-icons/fi";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    updateDoc
} from "firebase/firestore";
import { useAuth } from "@/app/components/AuthProvider";
import { toast } from "react-hot-toast";
import { Contact } from "@/lib/types";

export default function ContactsPage() {
    const { user } = useAuth();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "lead" as const,
        tags: [] as string[],
        notes: ""
    });

    const fetchContacts = async () => {
        if (!user) return;
        try {
            const q = query(collection(db, "contacts"), where("ownerId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const fetchedContacts: Contact[] = [];
            querySnapshot.forEach((doc) => {
                fetchedContacts.push({ id: doc.id, ...doc.data() } as Contact);
            });
            setContacts(fetchedContacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const newContact = {
                ...formData,
                ownerId: user.uid,
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, "contacts"), newContact);
            setContacts([...contacts, { id: docRef.id, ...newContact } as Contact]);
            setIsModalOpen(false);
            setFormData({ name: "", email: "", phone: "", company: "", status: "lead", tags: [], notes: "" });
            toast.success("Contact added successfully!");
        } catch (error) {
            toast.error("Error adding contact");
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Contacts</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Manage your leads and clients in one place.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center gap-2"
                >
                    <FiPlus /> Add Contact
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                    />
                </div>
                <button className="px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 text-gray-500 hover:bg-gray-50 transition-all">
                    <FiFilter />
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden text-slate-950 dark:text-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Name</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Contact Details</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-bold italic">Loading contacts...</td>
                                </tr>
                            ) : filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-bold italic">No contacts found.</td>
                                </tr>
                            ) : (
                                filteredContacts.map(contact => (
                                    <tr key={contact.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black">
                                                    {contact.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{contact.name}</p>
                                                    <p className="text-xs text-gray-500 font-bold">{contact.company || "Independent"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-bold">
                                                    <FiMail size={14} /> {contact.email}
                                                </div>
                                                {contact.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                                                        <FiPhone size={14} /> {contact.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${contact.status === 'client'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : contact.status === 'lead'
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400 hover:text-slate-900">
                                                <FiMoreVertical />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Contact Modal */}
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
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Add New Contact</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400"
                                >
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Company</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm appearance-none"
                                        >
                                            <option value="lead">Lead</option>
                                            <option value="client">Client</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Notes</label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
                                    >
                                        Save Contact
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
