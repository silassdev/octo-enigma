"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiBriefcase, FiPhone, FiCheckCircle, FiLoader, FiMessageCircle } from "react-icons/fi";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function OnboardingPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        jobTitle: "",
        company: "",
        phoneNumber: "",
        bio: "",
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
        if (user?.displayName) {
            setFormData(prev => ({ ...prev, name: user.displayName || "" }));
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            await setDoc(doc(db, "users", user.uid), {
                ...formData,
                email: user.email,
                onboardingCompleted: true,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            toast.success("Welcome aboard! Your profile is ready.");
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Onboarding error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    const steps = [
        { id: 1, title: "Basics", icon: <FiUser /> },
        { id: 2, title: "Professional", icon: <FiBriefcase /> },
        { id: 3, title: "Finalize", icon: <FiCheckCircle /> },
    ];

    return (
        <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2rem] p-8 md:p-12 border border-white/20 backdrop-blur-2xl shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass border border-white/20"
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Setup Your Profile</span>
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                            Welcome to <span className="text-brand-primary">MicroCRM</span>, {user?.displayName?.split(' ')[0] || "there"}!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tell us a bit about yourself to personalize your experience.
                        </p>
                    </div>

                    {/* Step Progress */}
                    <div className="flex justify-between items-center mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10" />
                        <motion.div
                            className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -z-10"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        />
                        {steps.map((s) => (
                            <div
                                key={s.id}
                                className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-brand-primary' : 'text-gray-400'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-brand-primary text-white scale-110' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                    {s.icon}
                                </div>
                                <span className="text-xs font-bold uppercase">{s.title}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-bold mb-2 ml-1">Full Name</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-brand-primary outline-none transition-all text-slate-900 dark:text-white"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-brand-primary outline-none transition-all text-slate-900 dark:text-white"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-bold mb-2 ml-1">Job Title</label>
                                        <div className="relative">
                                            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.jobTitle}
                                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-brand-primary outline-none transition-all text-slate-900 dark:text-white"
                                                placeholder="Freelance Designer"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 ml-1">Company</label>
                                        <div className="relative">
                                            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-brand-primary outline-none transition-all text-slate-900 dark:text-white"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-bold mb-2 ml-1">Bio / Profile Intro</label>
                                        <div className="relative">
                                            <FiMessageCircle className="absolute left-4 top-6 text-gray-400" />
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-brand-primary outline-none transition-all min-h-[120px] resize-none text-slate-900 dark:text-white"
                                                placeholder="Tell us a bit about what you do..."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-4 pt-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-slate-900 dark:text-white"
                                >
                                    Back
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-brand-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-brand-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <FiLoader className="animate-spin" /> : "Complete Setup"}
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
