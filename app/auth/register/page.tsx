"use client";

import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiArrowRight, FiBox } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: name });

            // Initialize user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                displayName: name,
                email: email,
                plan: "free",
                createdAt: new Date().toISOString()
            });

            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const { user } = await signInWithPopup(auth, provider);

            // Check if user document exists, if not create it
            await setDoc(doc(db, "users", user.uid), {
                displayName: user.displayName,
                email: user.email,
                plan: "free",
                createdAt: new Date().toISOString()
            }, { merge: true });

            toast.success("Welcome!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
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
                <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-primary text-white shadow-xl shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                        <FiBox className="w-7 h-7" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                        MicroCRM<span className="text-brand-primary">.</span>
                    </span>
                </Link>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create your account</h2>
                <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-brand-primary hover:text-brand-dark transition-colors">
                        Sign in here
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
                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-bold text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-primary/25 text-sm font-black text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : <><FiArrowRight /> Create Account</>}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100 dark:border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
                                <span className="px-4 bg-white dark:bg-slate-900 text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                            >
                                <FcGoogle size={20} />
                                <span>Google</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
