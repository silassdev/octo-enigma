import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit, Timestamp, addDoc, doc as fsDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { AttentionItem, Contact, Project } from "./types";

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
export async function getContacts() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(
            collection(db, "contacts"),
            where("ownerId", "==", user.uid)
        );
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}

export async function saveContact(contactData: Partial<Contact>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Unauthorized");

    try {
        const data = {
            ...contactData,
            ownerId: user.uid,
            updatedAt: new Date().toISOString()
        };

        if (contactData.id) {
            const ref = fsDoc(db, "contacts", contactData.id);
            await updateDoc(ref, data);
            return contactData.id;
        } else {
            const ref = collection(db, "contacts");
            const res = await addDoc(ref, {
                ...data,
                createdAt: new Date().toISOString(),
                status: data.status || 'lead',
                tags: data.tags || []
            });
            return res.id;
        }
    } catch (error) {
        console.error("Error saving contact:", error);
        throw error;
    }
}
export async function getProjects() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(
            collection(db, "projects"),
            where("ownerId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const projects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        
        const contactsMap: Record<string, string> = {};
        const contactsSnap = await getDocs(query(collection(db, "contacts"), where("ownerId", "==", user.uid)));
        contactsSnap.forEach(doc => {
            contactsMap[doc.id] = doc.data().name;
        });

        return projects.map(p => ({
            ...p,
            contactName: contactsMap[p.contactId] || "Unknown Client"
        }));
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export async function saveProject(projectData: Partial<Project>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Unauthorized");

    try {
        const data = {
            ...projectData,
            ownerId: user.uid,
            updatedAt: new Date().toISOString()
        };

        if (projectData.id) {
            const ref = fsDoc(db, "projects", projectData.id);
            await updateDoc(ref, data);
            return projectData.id;
        } else {
            const ref = collection(db, "projects");
            const res = await addDoc(ref, {
                ...data,
                createdAt: new Date().toISOString(),
                status: data.status || 'planning'
            });
            return res.id;
        }
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
}
