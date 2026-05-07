"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiBriefcase, FiFileText, FiDollarSign, FiPieChart, FiSettings } from "react-icons/fi";
import { clsx } from "clsx";

const navItems = [
    { label: "Overview", href: "/dashboard", icon: <FiHome /> },
    { label: "Contacts", href: "/dashboard/contacts", icon: <FiUsers /> },
    { label: "Projects", href: "/dashboard/projects", icon: <FiBriefcase /> },
    { label: "Invoices", href: "/dashboard/invoices", icon: <FiFileText /> },
    { label: "Expenses", href: "/dashboard/expenses", icon: <FiDollarSign /> },
    { label: "Reports", href: "/dashboard/reports", icon: <FiPieChart /> },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
<<<<<<< HEAD
        <aside className="w-64 border-r border-white/5 dark:border-white/5 bg-white dark:bg-[#121212] h-screen sticky top-0 flex flex-col pt-24 transition-colors duration-500">
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
=======
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col z-40 pt-20">
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navItems.map((item) => {
>>>>>>> b4304e4df5b8e22515e24302527ff8fb7a0c39d6
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                                isActive
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <span className={clsx("text-lg", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600")}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                    href="/dashboard/settings"
                    className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                        pathname === "/dashboard/settings"
                            ? "bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    <FiSettings className="text-lg" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
