"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiAlertCircle, FiArrowRight, FiLoader, FiCalendar, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { clsx } from "clsx";
import { getDashboardStats, getNeedsAttentionItems, getRecentProjects, getTasks, saveTask } from "@/lib/actions";
import StatsGrid from "@/app/components/StatsGrid";
import { useAuth } from "@/app/components/AuthProvider";
import ProjectModal from "@/app/components/ProjectModal";
import TaskModal from "@/app/components/TaskModal";
import AdminOverview from "@/app/components/AdminOverview";
import { Project, Task } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const isAdmin = profile?.role === 'admin';
    const [stats, setStats] = useState<any[]>([]);
    const [attentionItems, setAttentionItems] = useState<any[]>([]);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const loadDashboard = async () => {
        if (user) {
            try {
                const [statsData, attentionData, projectsData, tasksData] = await Promise.all([
                    getDashboardStats(),
                    getNeedsAttentionItems(),
                    getRecentProjects(3),
                    getTasks()
                ]);
                setStats(statsData);
                setAttentionItems(attentionData);
                setRecentProjects(projectsData);
                setTasks(tasksData);
            } catch (error) {
                console.error("Dashboard load error:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!authLoading) {
            loadDashboard();
        }
    }, [user, authLoading]);

    const handleAddTask = () => {
        setIsTaskModalOpen(true);
    };

    if (authLoading || (loading && !user)) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (isAdmin) {
        return <AdminOverview />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Overview</h1>
                        {profile?.plan && (
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                profile.plan === 'pro' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" :
                                profile.plan === 'lifetime' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                "bg-slate-100 text-slate-500 border-slate-200"
                            )}>
                                {profile.plan}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/reports" className="px-6 py-3 rounded-xl glass border border-gray-200 dark:border-gray-800 text-sm font-bold hover:bg-white dark:hover:bg-gray-800 transition-all">
                        View Reports
                    </Link>
                    <button 
                        onClick={() => setIsProjectModalOpen(true)}
                        className="px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center gap-2"
                    >
                        <FiPlus /> New Project
                    </button>
                </div>
            </div>

            <StatsGrid stats={stats} />

            {attentionItems.length > 0 && (
                <div className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/20 p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-orange-900 dark:text-orange-400 flex items-center gap-2">
                            <FiAlertCircle className="w-6 h-6" /> Needs Attention
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600/50 dark:text-orange-400/50 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                            {attentionItems.length} Items
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {attentionItems.map((item) => (
                            <Link key={item.id} href={item.link} className="group relative flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-transparent shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                                        item.severity === 'high' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                                    )}>
                                        {item.type === 'invoice' ? '$' : 'P'}
                                    </div>
                                    <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <FiArrowRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">{item.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.reason}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black flex items-center gap-2">
                                Recent Projects 
                            </h2>
                            <Link href="/dashboard/projects" className="text-[10px] font-black px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-all uppercase tracking-widest">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentProjects.length > 0 ? recentProjects.map((project, i) => (
                                <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                                            P{i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">{project.title}</h4>
                                            <p className="text-xs text-gray-500">
                                                {project.contactName || "No Client"} • Due in {Math.max(0, Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:block">
                                            <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-brand-primary transition-all duration-1000" 
                                                    style={{ width: `${project.progress || 0}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-brand-primary">{project.progress || 0}%</span>
                                    </div>
                                </Link>
                            )) : (
                                <div className="py-10 text-center">
                                    <p className="text-gray-400 font-bold text-sm">No recent projects. Start a new one!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-xl font-black mb-6">Upcoming Tasks</h2>
                        <div className="space-y-4">
                            {tasks.length > 0 ? tasks.map((task, i) => (
                                <div key={task.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-all">
                                    <div className={clsx(
                                        "w-2 h-2 mt-1.5 rounded-full shrink-0",
                                        task.type === 'high' ? 'bg-red-500' : task.type === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                                    )} />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{task.label}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{task.time}</p>
                                    </div>
                                    <button 
                                        onClick={async () => {
                                            await saveTask({ ...task, completed: true });
                                            loadDashboard();
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-emerald-500 hover:text-emerald-600 transition-all p-1"
                                    >
                                        <FiCheckCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="py-6 text-center">
                                    <p className="text-gray-400 font-bold text-sm italic">All caught up!</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleAddTask}
                            className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 text-sm font-bold hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                        >
                            + Add Quick Task
                        </button>
                    </div>
                </div>
            </div>

            <ProjectModal 
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSuccess={loadDashboard}
            />

            <TaskModal 
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={loadDashboard}
            />
        </div>
    );
}
