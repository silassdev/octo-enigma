import { DashboardSkeleton } from "@/app/components/Skeleton";

export default function Loading() {
    return (
        <div className="p-8">
            <DashboardSkeleton />
        </div>
    );
}
