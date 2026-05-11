"use client";

import { clsx } from "clsx";

interface InvoiceStatusBadgeProps {
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    className?: string;
}

export default function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
    const styles = {
        draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        sent: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        paid: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
        overdue: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    };

    return (
        <span className={clsx(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            styles[status],
            className
        )}>
            {status}
        </span>
    );
}
