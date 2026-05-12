"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { FiLoader, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

function AuthActionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [requirePasswordInput, setRequirePasswordInput] = useState(false);

    useEffect(() => {
        if (!mode || !oobCode) {
            setError("Invalid request.");
            setLoading(false);
            return;
        }

        const handleAction = async () => {
            try {
                if (mode === 'verifyEmail') {
                    await applyActionCode(auth, oobCode);
                    setSuccess("Your email has been successfully verified!");
                    setLoading(false);
                    // Optionally redirect to dashboard after a delay
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 3000);
                } else if (mode === 'resetPassword') {
                    // Verify the code first
                    const emailResponse = await verifyPasswordResetCode(auth, oobCode);
                    setEmail(emailResponse);
                    setRequirePasswordInput(true);
                    setLoading(false);
                } else if (mode === 'recoverEmail') {
                    // Similar implementation for email recovery if needed
                    setError("Email recovery is not yet supported in this custom view.");
                    setLoading(false);
                } else {
                    setError("Unknown action mode.");
                    setLoading(false);
                }
            } catch (err: any) {
                console.error("Auth action error:", err);
                setError(err.message || "An error occurred during authentication.");
                setLoading(false);
            }
        };

        handleAction();
    }, [mode, oobCode, router]);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode as string, newPassword);
            toast.success("Password has been reset successfully!");
            setSuccess("Password reset successful. You can now log in.");
            setRequirePasswordInput(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to reset password");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
                <p className="text-gray-500 font-bold text-sm">Processing request...</p>
            </div>
        );
    }

    if (error && !requirePasswordInput) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <FiXCircle className="w-16 h-16 text-red-500 mb-2" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Action Failed</h2>
                <p className="text-gray-500 font-bold max-w-sm">{error}</p>
                <Link href="/login" className="mt-6 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    Return to Login
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <FiCheckCircle className="w-16 h-16 text-brand-primary mb-2" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Success!</h2>
                <p className="text-gray-500 font-bold max-w-sm mb-6">{success}</p>
                {mode !== 'verifyEmail' && (
                    <Link href="/login" className="mt-6 px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">
                        Go to Login
                    </Link>
                )}
            </div>
        );
    }

    if (requirePasswordInput) {
        return (
             <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">Reset Password</h2>
                    <p className="text-gray-500 font-bold text-sm">Resetting password for <span className="text-brand-primary">{email}</span></p>
                </div>
                <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 ml-1 text-slate-900 dark:text-white">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 border border-transparent focus:border-brand-primary outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !newPassword}
                        className="w-full py-4 rounded-2xl bg-brand-primary text-white font-black hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20 flex flex-center items-center justify-center"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : "Save New Password"}
                    </button>
                </form>
             </div>
        );
    }

    return null;
}

export default function AuthActionPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl glass rounded-[2.5rem] p-8 md:p-12 border border-white/20 dark:border-white/5 backdrop-blur-2xl shadow-2xl flex flex-col items-center"
            >
                <div className="mb-8">
                     <Link href="/" className="text-2xl font-black text-brand-primary tracking-tighter">
                        MicroCRM<span className="text-slate-900 dark:text-white">.</span>
                     </Link>
                </div>
                
                <Suspense fallback={<FiLoader className="w-8 h-8 animate-spin text-brand-primary" />}>
                     <AuthActionContent />
                </Suspense>
            </motion.div>
        </main>
    );
}
