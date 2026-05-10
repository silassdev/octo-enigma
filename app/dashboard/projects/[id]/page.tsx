"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FiClock, FiDollarSign, FiPlus, FiArrowLeft, FiLoader, FiFileText } from 'react-icons/fi';
import Link from 'next/link';
import { Project } from '@/lib/types';
import clsx from 'clsx';

export default function ProjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            const docRef = doc(db, "projects", id as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() } as Project);
            }
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    useEffect(() => {
        if (isTimerActive) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerActive]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!project) {
        return <div className="text-center py-20 font-bold text-gray-500">Project not found</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/projects" className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:text-brand-primary transition-all">
                    <FiArrowLeft />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">{project.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Project Details & Smart Actions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black">Overview</h2>
                            <span className="px-4 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider">
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.description || "No description provided for this project."}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-brand-primary/5 border border-brand-primary/20 p-8 rounded-[2rem] shadow-sm">
                        <h2 className="text-lg font-black text-brand-primary mb-6 flex items-center gap-2">
                             Smart Actions
                        </h2>
                        <div className="space-y-4">
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-brand-primary/10 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active Session</p>
                                <p className={clsx("text-4xl font-black mb-4 tabular-nums", isTimerActive ? "text-brand-primary animate-pulse" : "text-gray-300")}>
                                    {formatTime(timeElapsed)}
                                </p>
                                <button 
                                    onClick={() => setIsTimerActive(!isTimerActive)}
                                    className={clsx(
                                        "w-full py-3 rounded-xl font-bold transition-all shadow-lg",
                                        isTimerActive 
                                            ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" 
                                            : "bg-brand-primary text-white shadow-brand-primary/20 hover:bg-brand-dark"
                                    )}
                                >
                                    {isTimerActive ? "Stop Timer" : "Start Tracking"}
                                </button>
                            </div>

                            <button 
                                onClick={() => router.push(`/dashboard/invoices/new?projectId=${project.id}`)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-brand-primary/20 hover:border-brand-primary hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <FiFileText className="text-brand-primary" />
                                    <span className="font-bold text-sm">Generate Invoice</span>
                                </div>
                                <FiArrowLeft className="rotate-180 text-gray-300 group-hover:text-brand-primary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
