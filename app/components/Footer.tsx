"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Footer() {
    const { user, loading } = useAuth();

    // Hide footer if user is logged in
    if (!loading && user) {
        return null;
    }

    return (
        <footer className="mt-20 py-12 glass border-t-0">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-100 dark:border-gray-800 pb-12">
                    <div className="space-y-4">
                        <div className="font-black text-2xl tracking-tighter text-brand-primary">MicroCRM<span className="text-slate-900 dark:text-white">.</span></div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                            The minimal CRM and invoicing platform for freelancers who value time and simplicity.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-brand-primary">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <Link href="/dashboard" className="hover:text-brand-dark dark:hover:text-white transition-standard">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-brand-dark dark:hover:text-white transition-standard">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-brand-primary">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <Link href="/help" className="hover:text-brand-dark dark:hover:text-white transition-standard">
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                    <div className="text-xs text-gray-400">© {new Date().getFullYear()} MicroCRM. All rights reserved.</div>

                    <div className="flex gap-6 text-xs text-gray-400 font-bold uppercase tracking-tighter">
                        <Link href="/privacy" className="hover:text-brand-dark dark:hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-brand-dark dark:hover:text-white">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
