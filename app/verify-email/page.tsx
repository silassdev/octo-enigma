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

    // We are no longer enforcing that the user MUST be signed in on this page.
    // They are signed out immediately after registration to block access.
    useEffect(() => {
        if (!loading && user?.emailVerified) {
            router.push("/onboarding");
        }
    }, [user, loading, router]);

    const handleResend = async () => {
        // If not signed in (normal flow after registration), they can't resend from here
        // Usually, a distinct "resend email" flow requiring email/password would be needed if signed out,
        // but for now we'll just prompt them to log in to resend.
        if (!user) {
            toast.error("Please sign in first to resend the verification email.");
            router.push("/login");
            return;
        }
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
        if (!auth.currentUser) {
            // They are signed out. Prompt them to log in.
            toast.success("Please sign in to continue and verify your status.");
            router.push("/login");
            return;
        }
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

    if (loading) return null;

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
                    We sent a verification link to your email. <br />
                    Please check your inbox (and spam). Once verified, log in to continue.
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
                        onClick={() => router.push("/login")}
                        className="text-sm text-brand-primary hover:text-brand-dark font-bold flex items-center justify-center gap-2 w-full pt-4"
                    >
                        <FiLogOut className="w-3 h-3" /> Go to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
