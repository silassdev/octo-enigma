"use client";

import { useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    sendEmailVerification,
    signOut,
    getAdditionalUserInfo
} from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiBox, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const checkOnboarding = async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists() && userDoc.data().onboardingCompleted) {
                router.replace("/dashboard");
            } else {
                router.replace("/onboarding");
            }
        } catch (e) {
            console.error("Onboarding check failed:", e);
            router.replace("/onboarding");
        }
    };

    // Auto-redirect if already logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && !loading) {
                checkOnboarding(user.uid);
            }
        });
        return () => unsubscribe();
    }, [router, loading]);

    const handleGoogleRegister = async () => {
        setLoading("google");
        const toastId = toast.loading("Connecting to Google...");
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const additionalInfo = getAdditionalUserInfo(result);
            
            if (!additionalInfo?.isNewUser) {
                await signOut(auth);
                toast.error("An account with this email already exists. Please log in instead.", { id: toastId });
                setLoading(null);
                return;
            }
            
            toast.loading("Creating your profile...", { id: toastId });
            
            // check if user exists in db, if not create
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                createdAt: new Date(),
                onboardingCompleted: false
            }, { merge: true });

            toast.success("Account created successfully!", { id: toastId });
            await checkOnboarding(result.user.uid);
        } catch (error: any) {
            console.error("Google Register Error:", error);
            if (error.code === 'auth/account-exists-with-different-credential') {
                toast.error("An account with this email already exists. Try signing in first.", { id: toastId });
            } else {
                toast.error(error.message || "Registration failed", { id: toastId });
            }
            setLoading(null);
        }
    };

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading("email");
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, {
                displayName: name
            });

            await sendEmailVerification(result.user);

            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                email: email,
                name: name,
                createdAt: new Date(),
                onboardingCompleted: false
            });

            // Sign out immediately so the unverified user cannot access the app.
            // They must verify their email first, then log in.
            await signOut(auth);

            toast.success("Account created! Please check your email to verify your account.");
            router.push("/verify-email");
            setLoading(null);
        } catch (error: any) {
            setLoading(null);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("This email is already registered. Please sign in instead.");
            } else if (error.code === 'auth/weak-password') {
                toast.error("Password should be at least 6 characters.");
            } else {
                toast.error("Failed to create account. Please try again.");
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
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create your free account</h2>
                <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand-primary hover:text-brand-dark transition-colors">
                        Sign in instead
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
                    <form className="space-y-6" onSubmit={handleEmailRegister}>
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
                            disabled={loading === "email"}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-primary/25 text-sm font-black text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading === "email" ? "Creating Account..." : <><FiArrowRight /> Create Account</>}
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
                                onClick={handleGoogleRegister}
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

                    <p className="mt-8 text-center text-xs text-gray-500">
                        By signing up, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-brand-primary">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="underline hover:text-brand-primary">Privacy Policy</Link>.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
