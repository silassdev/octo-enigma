export async function getDashboardStats() {
    // Mock implementation for dashboard stats
    return [
        { label: "Total Revenue", value: "$45,231.89", trend: "+20.1% from last month", isPositive: true },
        { label: "Active Projects", value: "12", trend: "+2 from last month", isPositive: true },
        { label: "Total Contacts", value: "2,493", trend: "+15% from last month", isPositive: true },
        { label: "Pending Invoices", value: "4", trend: "-2 from last month", isPositive: false },
    ];
}
