"use client";

import { clsx } from "clsx";

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div 
            className={clsx(
                "animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800",
                className
            )} 
            {...props} 
        />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-40" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
            </div>

            <Skeleton className="h-48 rounded-[2rem]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <Skeleton className="h-[400px] rounded-[2rem]" />
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-[400px] rounded-[2rem]" />
                </div>
            </div>
        </div>
    );
}
