"use client";

import Header from "@/app/components/Header";
import { FiCheck } from "react-icons/fi";
import Link from "next/link";

const plans = [
    {
        name: "Freelancer",
        price: "$0",
        period: "Free Forever",
        features: ["Unlimited Clients", "Basic Invoicing", "Expense Tracking", "Email Support"],
        cta: "Start for Free",
        href: "/auth/register"
    },
    {
        name: "Pro",
        price: "$29",
        period: "per month",
        features: ["Everything in Free", "API Access", "Custom Branding", "Priority Support"],
        cta: "Go Pro",
        href: "/auth/register?plan=pro",
        popular: true
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">Simple, transparent pricing.</h1>
                    <p className="text-xl text-gray-500">No contracts. No hidden fees. Cancel anytime.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <div key={index} className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900'}`}>
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className="text-gray-500 text-sm">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                            <FiCheck className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href} className={`block w-full py-4 rounded-xl text-center font-bold transition-all ${plan.popular ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-dark' : 'bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
