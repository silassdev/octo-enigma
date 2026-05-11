"use client";

import { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiBox } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    // Auto-redirect if already logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && !loading) {
                checkOnboarding(user.uid);
            }
        });
        return () => unsubscribe();
    }, [router, loading]);

    const checkOnboarding = async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists() && userDoc.data().onboardingCompleted) {
                router.replace("/dashboard");
            } else {
                router.replace("/onboarding");
            }
        } catch (e) {
            console.error(e);
            setLoading(null);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading("google");
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            toast.success("Signed in with Google!");
            await checkOnboarding(result.user.uid);
        } catch (error: any) {
            toast.error(error.message);
            setLoading(null);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading("email");
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            // Reload to get the latest emailVerified status from Firebase
            await result.user.reload();
            const freshUser = auth.currentUser;

            if (!freshUser?.emailVerified) {
                // Sign out so the unverified session doesn't persist
                await signOut(auth);
                toast.error("Please verify your email first. Check your inbox for the verification link.");
                router.push("/verify-email");
                setLoading(null);
                return;
            }
            toast.success("Welcome back!");
            // Do NOT set loading to null here, wait for redirect
            await checkOnboarding(result.user.uid);
        } catch (error: any) {
            setLoading(null);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                toast.error("Invalid email or password. Please try again.");
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Too many failed attempts. Please try again later.");
            } else {
                toast.error("Failed to sign in. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md text-center"
            >
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sign in to your account</h2>
                <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                    Or{" "}
                    <Link href="/auth/register" className="text-brand-primary hover:text-brand-dark transition-colors">
                        create a new account for free
                    </Link>
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white dark:bg-slate-900 py-10 px-8 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-3xl">
                    <form className="space-y-6" onSubmit={handleEmailLogin}>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-bold text-sm"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-bold text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-500 dark:text-gray-400">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-xs font-bold">
                                <Link href="/auth/forgot-password" className="text-brand-primary hover:text-brand-dark transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading === "email"}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-primary/25 text-sm font-black text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading === "email" ? "Signing in..." : <><FiArrowRight /> Sign In</>}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100 dark:border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
                                <span className="px-4 bg-white dark:bg-slate-900 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading === "google"}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50"
                            >
                                {loading === "google" ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-gray-300 border-t-brand-primary rounded-full"
                                    />
                                ) : (
                                    <FcGoogle size={20} />
                                )}
                                <span>Google</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
