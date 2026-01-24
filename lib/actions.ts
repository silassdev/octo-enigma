"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where, getDocs, limit, orderBy } from "firebase/firestore";

export const getDashboardStats = unstable_cache(
    async () => {
        try {
            const usersCol = collection(db, "users");

            // Total Users
            const totalSnapshot = await getCountFromServer(usersCol);
            const totalCount = totalSnapshot.data().count;

            // Onboarded Users
            const onboardedQuery = query(usersCol, where("onboardingCompleted", "==", true));
            const onboardedSnapshot = await getCountFromServer(onboardedQuery);
            const onboardedCount = onboardedSnapshot.data().count;

            // Job Distribution (Manual aggregation for now since Firestore is limited)
            const jobsQuery = query(usersCol, where("onboardingCompleted", "==", true), limit(50));
            const jobsSnapshot = await getDocs(jobsQuery);
            const jobCounts: Record<string, number> = {};

            jobsSnapshot.forEach(doc => {
                const job = doc.data().jobTitle || "Other";
                jobCounts[job] = (jobCounts[job] || 0) + 1;
            });

            const sortedJobs = Object.entries(jobCounts)
                .map(([_id, count]) => ({ _id, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            return {
                total: totalCount,
                onboarded: onboardedCount,
                jobs: sortedJobs
            };
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            return { total: 0, onboarded: 0, jobs: [] };
        }
    },
    ["dashboard-stats"],
    { revalidate: 600, tags: ["dashboard"] }
);
