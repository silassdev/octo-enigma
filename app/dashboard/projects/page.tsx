"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiGrid, FiList, FiMoreVertical, FiClock, FiDollarSign, FiCalendar, FiArrowRight, FiLoader, FiLayout } from "react-icons/fi";
import { getProjects } from "@/lib/actions";
import { Project } from "@/lib/types";
import ProjectModal from "@/app/components/ProjectModal";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<(Project & { contactName?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const fetchProjects = async () => {
        setLoading(true);
        const data = await getProjects();
        setProjects(data as (Project & { contactName?: string })[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500';
            case 'in-progress': return 'bg-brand-primary';
            case 'on-hold': return 'bg-amber-500';
            case 'planning': return 'bg-slate-400';
            default: return 'bg-slate-400';
        }
    };

    if (loading && projects.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Projects</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Track your roadmap and active sprints.</p>
                </div>
                <button 
                    onClick={handleNew}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/25 hover:bg-brand-dark transition-all"
                >
                    <FiPlus /> New Project
                </button>
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={project.id}
                            className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", getStatusColor(project.status))}>
                                    <FiLayout className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        project.status === 'in-progress' ? "bg-brand-primary/10 text-brand-primary" :
                                        project.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                                        "bg-gray-100 text-gray-500"
                                    )}>
                                        {project.status.replace('-', ' ')}
                                    </span>
                                    <button 
                                        onClick={() => handleEdit(project)}
                                        className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 transition-all"
                                    >
                                        <FiMoreVertical />
                                    </button>
                                </div>
                            </div>

                            <Link href={`/dashboard/projects/${project.id}`} className="block group/title">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover/title:text-brand-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                                    Client: <span className="text-gray-600 dark:text-gray-300">{project.contactName}</span>
                                </p>
                            </Link>

                            <div className="bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</p>
                                    <p className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                                        <FiDollarSign className="text-brand-primary" /> {project.budget?.toLocaleString() || '0'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deadline</p>
                                    <p className="font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1 text-sm">
                                        <FiCalendar className="text-amber-500" /> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
                                    </p>
                                </div>
                            </div>

                            <Link 
                                href={`/dashboard/projects/${project.id}`}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-primary dark:hover:bg-brand-primary hover:text-white dark:hover:text-white transition-all shadow-lg"
                            >
                                Details & Tracker <FiArrowRight />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                    <div className="w-24 h-24 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-purple-500 text-4xl transform -rotate-12 group-hover:rotate-0 transition-transform">
                        <FiLayout />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Launch your first project</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto font-bold leading-relaxed">
                        Organize your work, track time, and send invoices with project-based billing.
                    </p>
                    <button 
                        onClick={handleNew}
                        className="px-10 py-5 rounded-2xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-primary/25 hover:opacity-90 transition-all flex items-center gap-3 mx-auto"
                    >
                        <FiPlus className="w-5 h-5" /> Start New Project
                    </button>
                </div>
            )}

            <ProjectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProjects}
                initialData={editingProject}
            />
        </div>
    );
}
