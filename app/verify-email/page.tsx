"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { auth } from "@/lib/firebase";
import { sendEmailVerification, signOut, reload } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMail, FiRefreshCw, FiLogOut, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            // Double check auth state directly to avoid race conditions with context updates
            if (!auth.currentUser) {
                router.push("/login");
            }
        }
        if (!loading && user?.emailVerified) {
            router.push("/onboarding");
        }
    }, [user, loading, router]);

    const handleResend = async () => {
        if (!user) return;
        setSending(true);
        try {
            await sendEmailVerification(user);
            toast.success("Verification email sent!");
        } catch (error: any) {
            if (error.code === 'auth/too-many-requests') {
                toast.error("Too many requests. Please wait a moment.");
            } else {
                toast.error("Failed to send email.");
            }
        } finally {
            setSending(false);
        }
    };

    const handleCheckVerification = async () => {
        if (!auth.currentUser) return;
        setVerifying(true);
        try {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                toast.success("Email verified! Redirecting...");
                router.refresh();
                router.push("/onboarding");
            } else {
                toast.error("Email not verified yet. Please check your inbox.");
            }
        } catch (error) {
            toast.error("Something went wrong checking verification.");
        } finally {
            setVerifying(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800"
            >
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiMail className="w-10 h-10 text-brand-primary" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Verify your email</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    We sent a verification link to <span className="font-bold text-slate-800 dark:text-slate-200">{user.email}</span>. <br />
                    Please check your inbox (and spam) to continue.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleCheckVerification}
                        disabled={verifying}
                        className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {verifying ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
                        I have verified my email
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={sending}
                        className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                        {sending ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
                        Resend Verification Email
                    </button>

                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-bold flex items-center justify-center gap-2 w-full pt-4"
                    >
                        <FiLogOut className="w-3 h-3" /> Sign Out
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
