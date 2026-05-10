"use client";

import Sidebar from "@/app/components/Sidebar";
import CommandPalette from "@/app/components/CommandPalette";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <CommandPalette />
            <Sidebar />
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-7xl mx-auto pt-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
