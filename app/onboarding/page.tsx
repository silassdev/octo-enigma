"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiBriefcase, FiPhone, FiCheckCircle, FiLoader, FiMessageCircle } from "react-icons/fi";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function OnboardingPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const [formData, setFormData] = useState({
        name: "",
        jobTitle: "",
        company: "",
        phoneNumber: "",
        bio: "",
        plan: "free",
    });

    useEffect(() => {
        if (!authLoading && !user) {
            if (!auth.currentUser) {
                router.push("/login");
            }
        }

        const checkStatus = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().onboardingCompleted) {
                    router.replace("/dashboard");
                }
            }
        };
        checkStatus();

        if (user?.displayName) {
            setFormData(prev => ({ ...prev, name: user.displayName || "" }));
        }
    }, [user, authLoading, router]);

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            return formData.name.trim() !== "" && formData.phoneNumber.trim() !== "";
        }
        if (currentStep === 2) {
            return formData.jobTitle.trim() !== "" && formData.company.trim() !== "";
        }
        if (currentStep === 3) {
            return formData.bio.trim() !== "";
        }
        if (currentStep === 4) {
            return !!formData.plan;
        }
        return false;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (step !== 4) {
            console.log("handleSubmit fired but step is not 4. Current step:", step);
            if (validateStep(step)) {
                setStep(step + 1);
            } else {
                toast.error("Please fill in all required fields.");
            }
            return;
        }

        if (!user) return;
        setLoading(true);

        try {
            console.log("Saving profile for user:", user.uid);
            console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

            await setDoc(doc(db, "users", user.uid), {
                ...formData,
                plan: "free", // Force free initially, upgraded by Stripe webhook
                email: user.email,
                onboardingCompleted: true,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log("Profile saved successfully!");
            toast.success("Welcome aboard! Your profile is ready.");

            if (formData.plan !== 'free') {
                toast.loading("Preparing checkout...", { id: "stripe-loading" });
                // Redirect to Stripe Checkout
                const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        plan: formData.plan === 'pro' ? `pro_${billingCycle}` : formData.plan,
                        email: user.email,
                        userId: user.uid
                    }),
                });

                const data = await res.json();

                if (data.error) {
                    toast.error(data.error, { id: "stripe-loading" });
                    setLoading(false);
                    return;
                }

                if (data.url) {
                    toast.dismiss("stripe-loading");
                    window.location.href = data.url;
                    return;
                }

                toast.error("Failed to generate checkout link.", { id: "stripe-loading" });
                setLoading(false);
                return;
            }

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
        { id: 3, title: "About", icon: <FiMessageCircle /> },
        { id: 4, title: "Plan", icon: <FiCheckCircle /> },
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

                    <div className="space-y-6">
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
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-center items-center gap-4 mb-6">
                                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
                                        <button
                                            type="button"
                                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                            className="w-16 h-8 rounded-full bg-slate-100 dark:bg-slate-800 p-1.5 relative transition-all shadow-inner border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                                        >
                                            <motion.div
                                                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                                                className="w-5 h-5 rounded-full bg-brand-primary shadow-lg shadow-brand-primary/20"
                                            />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Yearly</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {[
                                            { id: 'free', title: 'Free', price: '$0', desc: '10 active projects, basic features.', period: 'forever' },
                                            { id: 'pro', title: 'Professional', price: billingCycle === 'yearly' ? '$16.80' : '$1.99', desc: 'Unlimited records, full telemetry, support.', recommended: true, period: billingCycle === 'yearly' ? 'billed annually' : 'billed monthly' },
                                            { id: 'lifetime', title: 'Infinite', price: '$69.90', desc: 'Complete lifetime access.', period: 'one-time payment' },
                                        ].map((plan) => (
                                            <div
                                                key={plan.id}
                                                onClick={() => setFormData({ ...formData, plan: plan.id as any })}
                                                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.plan === plan.id
                                                    ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10'
                                                    : 'border-transparent bg-gray-50 dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-800'
                                                    }`}
                                            >
                                                {plan.recommended && (
                                                    <span className="absolute -top-3 right-6 px-3 py-1 bg-brand-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                                                        Most Popular
                                                    </span>
                                                )}
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{plan.title}</h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">{plan.desc}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xl font-black text-brand-primary">{plan.price}</span>
                                                        <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">{plan.period}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                            {step < 4 && (
                                <button
                                    key={`continue-btn-${step}`}
                                    type="button"
                                    onClick={() => {
                                        if (validateStep(step)) {
                                            setStep(step + 1);
                                        } else {
                                            toast.error("Please fill in all fields to continue.");
                                        }
                                    }}
                                    className={`flex-1 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${validateStep(step) ? 'bg-brand-primary text-white hover:opacity-90 shadow-brand-primary/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Continue
                                </button>
                            )}
                            {step === 4 && (
                                <button
                                    key="submit-btn"
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !validateStep(4)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-brand-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <FiLoader className="animate-spin" /> : "Complete Setup"}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
