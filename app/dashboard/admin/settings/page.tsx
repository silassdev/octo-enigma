"use client";

import React, { useState, useEffect } from "react";
import { 
    FiSettings, 
    FiShield, 
    FiActivity, 
    FiGlobe, 
    FiMail, 
    FiLock, 
    FiLoader, 
    FiSave, 
    FiAlertTriangle,
    FiCheckCircle,
    FiPower
} from "react-icons/fi";
import { getSystemSettings, updateSystemSettings } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/components/AuthProvider";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";

export default function AdminSettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        if (authLoading || !user) return;
        setLoading(true);
        const data = await getSystemSettings();
        setSettings(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, [user, authLoading]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSystemSettings(settings);
            toast.success("System configurations updated!");
        } catch (error) {
            toast.error("Failed to update system settings");
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

    const sections = [
        { id: 'general', label: 'Platform Core', icon: <FiGlobe /> },
        { id: 'auth', label: 'Access Control', icon: <FiShield /> },
        { id: 'billing', label: 'Billing Policy', icon: <FiLock /> },
        { id: 'danger', label: 'System Ops', icon: <FiAlertTriangle /> },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        System Configuration <span className="text-brand-primary">.</span>
                    </h1>
                    <p className="text-gray-400 font-bold ml-1 tracking-tight">Global platform orchestration and metadata management</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={clsx(
                        "px-6 py-2.5 rounded-xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                        settings?.maintenanceMode 
                            ? "bg-amber-50 text-amber-500 border-amber-100" 
                            : "bg-emerald-50 text-emerald-500 border-emerald-100"
                    )}>
                        <div className={clsx("w-2 h-2 rounded-full", settings?.maintenanceMode ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
                        {settings?.maintenanceMode ? 'Maintenance Active' : 'System Operational'}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            type="button"
                            className={clsx(
                                "w-full flex items-center gap-4 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-left",
                                "hover:bg-gray-50 dark:hover:bg-slate-800/50",
                                "text-gray-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <span className="text-lg">{s.icon}</span>
                            {s.label}
                        </button>
                    ))}
                    <div className="pt-10">
                        <button 
                            disabled={saving}
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} {saving ? 'Verifying...' : 'Commit Changes'}
                        </button>
                    </div>
                </div>

                {/* Main Settings Body */}
                <div className="lg:col-span-9 space-y-10">
                    {/* Platform Core Section */}
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800 space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-50 dark:border-gray-800">
                            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl text-xl"><FiGlobe /></div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Platform Metadata</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global brand and support settings</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Universal App Name</label>
                                <input 
                                    type="text" 
                                    value={settings.appName}
                                    onChange={(e) => setSettings({...settings, appName: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Primary Support Email</label>
                                <input 
                                    type="email" 
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none ring-1 ring-gray-100 dark:ring-gray-800 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Access Control & Governance */}
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800 space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-50 dark:border-gray-800">
                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl text-xl"><FiShield /></div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Governance & Availability</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform-wide accessibility toggles</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { 
                                    id: 'maintenanceMode', 
                                    label: 'Global Maintenance Mode', 
                                    desc: 'Force all non-admin users to a maintenance screen.',
                                    icon: <FiPower />,
                                    color: 'text-amber-500' 
                                },
                                { 
                                    id: 'enableRegistration', 
                                    label: 'Unrestricted Registration', 
                                    desc: 'Enable or disable new user signups across the platform.',
                                    icon: <FiCheckCircle />,
                                    color: 'text-emerald-500' 
                                }
                            ].map((toggle) => (
                                <div key={toggle.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 hover:border-brand-primary/20 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={clsx("p-4 rounded-2xl text-xl shadow-sm bg-white dark:bg-slate-900", toggle.color)}>
                                            {toggle.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{toggle.label}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">{toggle.desc}</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setSettings({...settings, [toggle.id]: !settings[toggle.id]})}
                                        className={clsx(
                                            "w-16 h-8 rounded-full relative transition-all duration-300 shadow-inner",
                                            settings[toggle.id] ? "bg-brand-primary" : "bg-gray-200 dark:bg-slate-700"
                                        )}
                                    >
                                        <div className={clsx(
                                            "absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl transition-all duration-300",
                                            settings[toggle.id] ? "left-9" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-rose-50/50 dark:bg-rose-950/20 p-10 rounded-[3rem] border border-rose-100 dark:border-rose-900/50 space-y-6">
                        <div className="flex items-center gap-4">
                            <FiAlertTriangle className="text-3xl text-rose-500" />
                            <div>
                                <h3 className="text-xl font-black text-rose-900 dark:text-rose-100 tracking-tight">System Operations</h3>
                                <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-widest mt-1">Irreversible platform actions</p>
                            </div>
                        </div>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <button type="button" className="px-8 py-3 rounded-xl bg-white dark:bg-slate-900 text-rose-500 border border-rose-100 dark:border-rose-900 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-rose-500 hover:text-white shadow-sm">
                                Clear System Cache
                            </button>
                            <button type="button" className="px-8 py-3 rounded-xl bg-white dark:bg-slate-900 text-rose-500 border border-rose-100 dark:border-rose-900 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-rose-500 hover:text-white shadow-sm">
                                Flush All Sessions
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

