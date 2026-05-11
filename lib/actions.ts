import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from "firebase/firestore";
import { auth } from "./firebase";
import { AttentionItem } from "./types";

export async function getDashboardStats() {
    const user = auth.currentUser;
    if (!user) return [];

    // This is still a bit simplified, but let's fetch some real counts
    const projectsSnap = await getDocs(query(collection(db, "projects"), where("ownerId", "==", user.uid)));
    const invoicesSnap = await getDocs(query(collection(db, "invoices"), where("ownerId", "==", user.uid)));
    const contactsSnap = await getDocs(query(collection(db, "contacts"), where("ownerId", "==", user.uid)));

    const totalRevenue = invoicesSnap.docs.reduce((acc, doc) => {
        const data = doc.data();
        return data.status === 'paid' ? acc + (data.total || 0) : acc;
    }, 0);

    return [
        { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, trend: "+0% from last month", isPositive: true },
        { label: "Active Projects", value: projectsSnap.size.toString(), trend: "Current total", isPositive: true },
        { label: "Total Contacts", value: contactsSnap.size.toString(), trend: "Current total", isPositive: true },
        { label: "Pending Invoices", value: invoicesSnap.docs.filter(d => d.data().status !== 'paid').length.toString(), trend: "Awaiting payment", isPositive: false },
    ];
}

export async function getNeedsAttentionItems() {
    const user = auth.currentUser;
    if (!user) return [];

    const items: AttentionItem[] = [];

    // 1. Overdue Invoices
    const now = new Date();
    const overdueInvoices = await getDocs(query(
        collection(db, "invoices"),
        where("ownerId", "==", user.uid),
        where("status", "==", "sent"),
        where("dueDate", "<", now.toISOString())
    ));

    overdueInvoices.forEach(doc => {
        items.push({
            id: doc.id,
            type: 'invoice',
            title: `Invoice #${doc.id.slice(0, 5)} Overdue`,
            reason: `Was due on ${new Date(doc.data().dueDate).toLocaleDateString()}`,
            severity: 'high',
            link: `/dashboard/invoices/${doc.id}`
        });
    });

    // 2. Upcoming Project Deadlines (next 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    const upcomingProjects = await getDocs(query(
        collection(db, "projects"),
        where("ownerId", "==", user.uid),
        where("status", "==", "in-progress"),
        where("dueDate", ">=", now.toISOString()),
        where("dueDate", "<=", threeDaysFromNow.toISOString())
    ));

    upcomingProjects.forEach(doc => {
        items.push({
            id: doc.id,
            type: 'project',
            title: `Deadline Approaching: ${doc.data().title}`,
            reason: `Due in ${Math.ceil((new Date(doc.data().dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24))} days`,
            severity: 'medium',
            link: `/dashboard/projects/${doc.id}`
        });
    });

    return items;
}
