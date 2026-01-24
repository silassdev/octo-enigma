"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlus,
    FiSearch,
    FiBriefcase,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiX,
    FiMoreVertical,
    FiDollarSign
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
import { Project, Contact } from "@/lib/types";

export default function ProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        contactId: "",
        description: "",
        status: "planning" as const,
        budget: 0,
        dueDate: ""
    });

    const fetchData = async () => {
        if (!user) return;
        try {
            // Fetch Projects
            const pq = query(collection(db, "projects"), where("ownerId", "==", user.uid));
            const pSnapshot = await getDocs(pq);
            const fetchedProjects: Project[] = [];
            pSnapshot.forEach((doc) => {
                fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
            });
            setProjects(fetchedProjects);

            // Fetch Contacts (for the project selection)
            const cq = query(collection(db, "contacts"), where("ownerId", "==", user.uid));
            const cSnapshot = await getDocs(cq);
            const fetchedContacts: Contact[] = [];
            cSnapshot.forEach((doc) => {
                fetchedContacts.push({ id: doc.id, ...doc.data() } as Contact);
            });
            setContacts(fetchedContacts);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load projects");
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
            const newProject = {
                ...formData,
                ownerId: user.uid,
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, "projects"), newProject);
            setProjects([...projects, { id: docRef.id, ...newProject } as Project]);
            setIsModalOpen(false);
            setFormData({ title: "", contactId: "", description: "", status: "planning", budget: 0, dueDate: "" });
            toast.success("Project created successfully!");
        } catch (error) {
            toast.error("Error creating project");
        }
    };

    const getContactName = (id: string) => {
        return contacts.find(c => c.id === id)?.name || "Unknown Client";
    };

    const statusColors = {
        planning: "bg-blue-50 text-blue-600",
        "in-progress": "bg-purple-50 text-purple-600",
        completed: "bg-emerald-50 text-emerald-600",
        "on-hold": "bg-orange-50 text-orange-600"
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Projects</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Track your active work and deliverables.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center gap-2"
                >
                    <FiPlus /> New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">No projects yet. Start by creating one!</div>
                ) : (
                    projects.map(project => (
                        <motion.div
                            key={project.id}
                            whileHover={{ y: -4 }}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                    <FiBriefcase size={24} />
                                </div>
                                <button className="p-2 text-gray-400 hover:text-slate-900 transition-colors">
                                    <FiMoreVertical />
                                </button>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">{project.title}</h3>
                            <p className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest">{getContactName(project.contactId)}</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                    <FiClock className="text-brand-primary" />
                                    <span>Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No date"}</span>
                                </div>
                                {project.budget && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <FiDollarSign className="text-emerald-500" />
                                        <span>Budget: ${project.budget.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[project.status]}`}>
                                    {project.status.replace("-", " ")}
                                </span>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-gray-200" title="Team Member" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-brand-primary flex items-center justify-center text-[10px] text-white font-black">+1</div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Project Modal */}
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
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Create New Project</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400"
                                >
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Project Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Website Redesign"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Client / Contact</label>
                                    <select
                                        required
                                        value={formData.contactId}
                                        onChange={e => setFormData({ ...formData, contactId: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm appearance-none"
                                    >
                                        <option value="">Select a client</option>
                                        {contacts.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Budget</label>
                                        <div className="relative">
                                            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                            <input
                                                type="number"
                                                value={formData.budget}
                                                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Due Date</label>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
                                    >
                                        Create Project
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
