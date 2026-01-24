"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiUsers, FiDollarSign, FiActivity, FiShield, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminAnalyticsPage() {
    const { user, loading } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0, // Mocked for now
        totalRevenue: 0, // Mocked
        admins: 0
    });
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [secretKey, setSecretKey] = useState("");

    useEffect(() => {
        const checkAdmin = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role === "admin") {
                    setIsAdmin(true);
                    fetchStats();
                } else {
                    setIsAdmin(false);
                }
            }
        };
        if (!loading) checkAdmin();
    }, [user, loading]);

    const fetchStats = async () => {
        // In a real app, use a server-side aggregation or counters
        // This is expensive for large datasets!
        const usersSnapshot = await getDocs(collection(db, "users"));
        const adminsSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "admin")));

        setStats({
            totalUsers: usersSnapshot.size,
            activeUsers: Math.floor(usersSnapshot.size * 0.8),
            totalRevenue: usersSnapshot.size * 29, // Mock $29/user
            admins: adminsSnapshot.size
        });
    };

    const handleSeedAdmin = async () => {
        if (secretKey === "microcrm-admin-secret-2026" && user) {
            await updateDoc(doc(db, "users", user.uid), {
                role: "admin"
            });
            setIsAdmin(true);
            fetchStats();
            alert("You are now an admin!");
        } else {
            alert("Invalid key");
        }
    };

    if (loading) return <div>Loading...</div>;

    if (isAdmin === false) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <FiLock className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-8">You do not have permission to view this page.</p>

                {/* Secret Seed Mechanism */}
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Admin Seeding (Dev Only)</p>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            placeholder="Enter Secret Key"
                            className="bg-white dark:bg-black px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                        />
                        <button
                            onClick={handleSeedAdmin}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                        >
                            Promote Me
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black tracking-tight">Global Analytics</h1>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Admin View</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<FiUsers />} label="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                    <StatCard icon={<FiActivity />} label="Active Users" value={stats.activeUsers} color="bg-green-500" />
                    <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`$${stats.totalRevenue}`} color="bg-purple-500" />
                    <StatCard icon={<FiShield />} label="Admins" value={stats.admins} color="bg-red-500" />
                </div>

                {/* Placeholder for charts */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-xl h-96 flex items-center justify-center text-gray-400">
                    Chart Data Visualization Placeholder
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-xl"
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</h3>
                    <p className="text-2xl font-black">{value}</p>
                </div>
            </div>
        </motion.div>
    );
}
