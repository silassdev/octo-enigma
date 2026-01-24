"use server";

import { unstable_cache } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export const getDashboardStats = unstable_cache(
    async () => {
        try {
            await connectToDatabase();

            const stats = await User.aggregate([
                {
                    $facet: {
                        totalUsers: [{ $count: "count" }],
                        onboardedUsers: [
                            { $match: { onboardingCompleted: true } },
                            { $count: "count" }
                        ],
                        jobDistribution: [
                            { $match: { onboardingCompleted: true } },
                            { $group: { _id: "$jobTitle", count: { $sum: 1 } } },
                            { $sort: { count: -1 } },
                            { $limit: 5 }
                        ]
                    }
                }
            ]);

            return {
                total: stats[0].totalUsers[0]?.count || 0,
                onboarded: stats[0].onboardedUsers[0]?.count || 0,
                jobs: stats[0].jobDistribution || []
            };
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            return { total: 0, onboarded: 0, jobs: [] };
        }
    },
    ["dashboard-stats"],
    { revalidate: 600, tags: ["dashboard"] }
);
