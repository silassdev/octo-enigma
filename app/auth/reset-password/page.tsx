"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { FiLock, FiArrowRight, FiCheckCircle, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const oobCode = searchParams.get("oobCode");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!oobCode) {
            setError("Invalid or missing reset code.");
            setVerifying(false);
            return;
        }

        verifyPasswordResetCode(auth, oobCode)
            .then(() => {
                setVerifying(false);
            })
            .catch((err) => {
                console.error("Verification error:", err);
                setError("The reset link is invalid or has expired.");
                setVerifying(false);
            });
    }, [oobCode]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode!, newPassword);
            setSuccess(true);
            toast.success("Password updated successfully!");
        } catch (err: any) {
            console.error("Confirmation error:", err);
            toast.error(err.message || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="text-center py-12">
                <FiLoader className="w-10 h-10 animate-spin text-brand-primary mx-auto mb-4" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verifying reset link...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 mx-auto mb-6">
                    <FiAlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Oops!</h3>
                <p className="text-sm text-gray-500 mb-8 font-medium">{error}</p>
                <Link
                    href="/auth/forgot-password"
                    className="inline-block w-full text-center py-4 rounded-2xl bg-brand-primary text-white font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
                >
                    Request New Link
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 mx-auto mb-6">
                    <FiCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password Reset!</h3>
                <p className="text-sm text-gray-500 mb-8 font-medium">Your password has been securely updated. You can now sign in with your new credentials.</p>
                <Link
                    href="/login"
                    className="inline-block w-full text-center py-4 rounded-2xl bg-brand-primary text-white font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
                >
                    Sign In Now
                </Link>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleReset}>
            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                    New Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                    </div>
                    <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-bold text-sm"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                    Confirm New Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                    </div>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-bold text-sm"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-primary/25 text-sm font-black text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all uppercase tracking-widest disabled:opacity-50"
            >
                {loading ? "Updating..." : <><FiArrowRight /> Reset Password</>}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md text-center"
            >
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create New Password</h2>
                <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                    Almost there! Secure your account with a new password.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white dark:bg-slate-900 py-10 px-8 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-3xl">
                    <Suspense fallback={<FiLoader className="animate-spin" />}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    );
}
