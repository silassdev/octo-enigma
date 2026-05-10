"use client";

import React, { useState, useEffect } from 'react';
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FiPieChart, FiDollarSign, FiInfo, FiLoader } from 'react-icons/fi';

export default function TaxEstimationPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        income: 0,
        expenses: 0,
        profit: 0,
        estimatedTax: 0,
    });

    useEffect(() => {
        const fetchTaxData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const invoicesSnap = await getDocs(query(collection(db, "invoices"), where("ownerId", "==", user.uid), where("status", "==", "paid")));
            const expensesSnap = await getDocs(query(collection(db, "expenses"), where("ownerId", "==", user.uid)));

            const totalIncome = invoicesSnap.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0);
            const totalExpenses = expensesSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
            const profit = totalIncome - totalExpenses;
            
            // Simplified tax estimation (e.g., 25% for freelancers)
            const estimatedTax = profit > 0 ? profit * 0.25 : 0;

            setStats({
                income: totalIncome,
                expenses: totalExpenses,
                profit,
                estimatedTax,
            });
            setLoading(false);
        };
        fetchTaxData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Tax Estimation</h1>
                <p className="text-gray-500 dark:text-gray-400 font-bold">Projected tax liability based on real-time data</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: stats.income, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Total Expenses", value: stats.expenses, color: "text-red-500", bg: "bg-red-50" },
                    { label: "Net Profit", value: stats.profit, color: "text-brand-primary", bg: "bg-brand-primary/5" },
                    { label: "Estimated Tax", value: stats.estimatedTax, color: "text-orange-500", bg: "bg-orange-50" },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{item.label}</p>
                        <p className={`text-3xl font-black ${item.color}`}>
                            ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <FiInfo className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">How is this calculated?</h2>
                        <p className="text-sm text-gray-500 font-medium">Estimated tax is calculated at a flat 25% of your net profit.</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <FiPieChart className="text-gray-400" />
                            <span className="font-bold">Self-Employment Tax Rate</span>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">15.3%</span>
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <FiDollarSign className="text-gray-400" />
                            <span className="font-bold">Estimated Income Tax</span>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">~9.7%</span>
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-3xl bg-brand-primary text-white space-y-4">
                    <h3 className="text-lg font-black">Pro Tip: Save as you go</h3>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                        Freelancers often forget about taxes until April. We recommend setting aside **25-30%** of every paid invoice into a separate savings account to avoid surprises.
                    </p>
                </div>
            </div>
        </div>
    );
}
