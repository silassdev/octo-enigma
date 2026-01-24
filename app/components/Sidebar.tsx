"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiUsers,
    FiBriefcase,
    FiFileText,
    FiDollarSign,
    FiSettings,
    FiPieChart
} from "react-icons/fi";
import { clsx } from "clsx";

const menuItems = [
    { icon: FiHome, label: "Overview", href: "/dashboard" },
    { icon: FiUsers, label: "Contacts", href: "/dashboard/contacts" },
    { icon: FiBriefcase, label: "Projects", href: "/dashboard/projects" },
    { icon: FiFileText, label: "Invoices", href: "/dashboard/invoices" },
    { icon: FiDollarSign, label: "Expenses", href: "/dashboard/expenses" },
    { icon: FiPieChart, label: "Reports", href: "/dashboard/reports" },
    { icon: FiSettings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 h-screen sticky top-0 flex flex-col pt-24">
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                isActive
                                    ? "bg-brand-primary/10 text-brand-primary"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={clsx("w-5 h-5", isActive ? "text-brand-primary" : "text-gray-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="bg-gradient-to-br from-brand-primary to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-brand-primary/20">
                    <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Pro Plan</p>
                    <p className="text-sm font-black mb-3">Get unlimited invoices</p>
                    <Link
                        href="/pricing"
                        className="block text-center py-2 bg-white text-brand-primary rounded-lg text-xs font-black hover:bg-opacity-90 transition-all shadow-sm"
                    >
                        Upgrade Now
                    </Link>
                </div>
            </div>
        </aside>
    );
}
