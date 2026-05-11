"use client";

import React, { useState, useEffect } from "react";
import { 
    FiUser, 
    FiShield, 
    FiDollarSign, 
    FiBriefcase, 
    FiArrowLeft, 
    FiLoader,
    FiCheck,
    FiMail,
    FiCalendar,
    FiArrowUpRight,
    FiLayout,
    FiSettings,
    FiSave
} from "react-icons/fi";
import { getUserProfile, updateUserProfile } from "@/lib/actions";
import { useRouter, useParams } from "next/navigation";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const uid = params.id as string;
    
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getUserProfile(uid);
            if (data) {
                setProfile(data);
                setEditData(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [uid]);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await updateUserProfile(profile.id, editData);
            setProfile(editData);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!profile) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">User Not Found</h2>
            <button onClick={() => router.back()} className="text-brand-primary font-bold">Return to Directory</button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors mb-4 group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to users
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-brand-primary flex items-center justify-center text-4xl shadow-2xl">
                            {profile.name?.charAt(0) || profile.email?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">
                                {profile.name || "Untitled User"}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><FiMail /> {profile.email}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="flex items-center gap-1.5 text-brand-primary"><FiShield /> {profile.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 p-2 rounded-2xl flex gap-3 border border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={handleUpdate}
                        disabled={saving}
                        className="px-8 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center gap-2"
                    >
                        {saving ? <FiLoader className="animate-spin" /> : <FiSave />} Save Changes
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Controls */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 flex items-center gap-3">
                            <FiUser className="text-brand-primary" /> Profile Settings
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Display Name</label>
                                <input 
                                    type="text" 
                                    value={editData.name || ""}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Account Role</label>
                                <select 
                                    value={editData.role || "user"}
                                    onChange={(e) => setEditData({...editData, role: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold appearance-none focus:ring-2 focus:ring-brand-primary transition-all"
                                >
                                    <option value="user">Standard User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <FiSettings className="w-24 h-24 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight mb-8 relative z-10">Platform Plan</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                            {(['free', 'pro', 'lifetime'] as const).map(plan => (
                                <button
                                    key={plan}
                                    type="button"
                                    onClick={() => setEditData({...editData, plan: plan})}
                                    className={clsx(
                                        "flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300",
                                        editData.plan === plan 
                                            ? "bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105" 
                                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Status</span>
                                    <span className="text-lg font-black uppercase tracking-tighter">{plan}</span>
                                    {editData.plan === plan && <FiCheck className="mt-3 w-5 h-5 text-emerald-300" />}
                                </button>
                            ))}
                        </div>
                        <p className="mt-8 text-gray-400 text-xs font-bold text-center italic">Changes take effect immediately upon saving.</p>
                    </div>
                </div>

                {/* Account Insights */}
                <div className="lg:col-span-5 space-y-10">
                    <div className="bg-gray-50 dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Metadata</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FiCalendar className="text-brand-primary" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Joined</span>
                                </div>
                                <span className="text-sm font-black text-slate-900 dark:text-white">
                                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FiCheck className="text-emerald-500" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Onboarding</span>
                                </div>
                                <span className="text-sm font-black text-emerald-500">Completed</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FiArrowUpRight className="text-blue-500" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Profile ID</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                                    {profile.id.slice(0, 12)}...
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-primary/5 p-10 rounded-[3rem] border border-brand-primary/10 flex flex-col justify-between h-full">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-xl shadow-lg mb-6">
                                <FiLayout />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight line-clamp-1 truncate">Platform Usage Summary</h4>
                            <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                                Use the global dashboards to see aggregated project and revenue data for this user. Specialized user-level metrics are coming in V2.
                            </p>
                        </div>
                        <button className="mt-8 w-full py-4 rounded-2xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
                            View Activity Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

