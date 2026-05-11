import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit, Timestamp, addDoc, doc as fsDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { AttentionItem, Contact, Project, Invoice } from "./types";

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
    const allInvoices = await getDocs(query(
        collection(db, "invoices"),
        where("ownerId", "==", user.uid)
    ));

    allInvoices.forEach(doc => {
        const data = doc.data();
        if (data.status === 'sent' && data.dueDate < now.toISOString()) {
            items.push({
                id: doc.id,
                type: 'invoice',
                title: `Invoice #${doc.id.slice(0, 5)} Overdue`,
                reason: `Was due on ${new Date(data.dueDate).toLocaleDateString()}`,
                severity: 'high',
                link: `/dashboard/invoices/${doc.id}`
            });
        }
    });

    // 2. Upcoming Project Deadlines (next 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    const allProjects = await getDocs(query(
        collection(db, "projects"),
        where("ownerId", "==", user.uid)
    ));

    allProjects.forEach(doc => {
        const data = doc.data();
        if (data.status === 'in-progress' && data.dueDate >= now.toISOString() && data.dueDate <= threeDaysFromNow.toISOString()) {
            items.push({
                id: doc.id,
                type: 'project',
                title: `Deadline Approaching: ${data.title}`,
                reason: `Due in ${Math.ceil((new Date(data.dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24))} days`,
                severity: 'medium',
                link: `/dashboard/projects/${doc.id}`
            });
        }
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
            where("ownerId", "==", user.uid)
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
export async function getInvoices() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(
            collection(db, "invoices"),
            where("ownerId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const invoices = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));

        const contactsMap: Record<string, string> = {};
        const contactsSnap = await getDocs(query(collection(db, "contacts"), where("ownerId", "==", user.uid)));
        contactsSnap.forEach(doc => {
            contactsMap[doc.id] = doc.data().name;
        });

        return invoices.map(inv => ({
            ...inv,
            contactName: contactsMap[inv.contactId] || "Unknown Client"
        }));
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return [];
    }
}

export async function saveInvoice(invoiceData: Partial<Invoice>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Unauthorized");

    try {
        const data = {
            ...invoiceData,
            ownerId: user.uid,
            updatedAt: new Date().toISOString()
        };

        if (invoiceData.id) {
            const ref = fsDoc(db, "invoices", invoiceData.id);
            await updateDoc(ref, data);
            return invoiceData.id;
        } else {
            const ref = collection(db, "invoices");
            const res = await addDoc(ref, {
                ...data,
                createdAt: new Date().toISOString(),
                status: data.status || 'draft'
            });
            return res.id;
        }
    } catch (error) {
        console.error("Error saving invoice:", error);
        throw error;
    }
}

export async function getExpenses() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(
            collection(db, "expenses"),
            where("ownerId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const expenses = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));

        // Fetch contacts and projects for mapping
        const contactsMap: Record<string, string> = {};
        const projectsMap: Record<string, string> = {};
        
        const [contactsSnap, projectsSnap] = await Promise.all([
            getDocs(query(collection(db, "contacts"), where("ownerId", "==", user.uid))),
            getDocs(query(collection(db, "projects"), where("ownerId", "==", user.uid)))
        ]);

        contactsSnap.forEach(doc => contactsMap[doc.id] = doc.data().name);
        projectsSnap.forEach(doc => projectsMap[doc.id] = doc.data().title);

        return expenses.map(e => ({
            ...e,
            contactName: e.contactId ? contactsMap[e.contactId] : undefined,
            projectName: e.projectId ? projectsMap[e.projectId] : undefined
        }));
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
    }
}

export async function saveExpense(expenseData: Partial<Expense>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Unauthorized");

    try {
        const data = {
            ...expenseData,
            ownerId: user.uid,
            updatedAt: new Date().toISOString()
        };

        if (expenseData.id) {
            const ref = fsDoc(db, "expenses", expenseData.id);
            await updateDoc(ref, data);
            return expenseData.id;
        } else {
            const ref = collection(db, "expenses");
            const res = await addDoc(ref, {
                ...data,
                createdAt: new Date().toISOString(),
                date: data.date || new Date().toISOString()
            });
            return res.id;
        }
    } catch (error) {
        console.error("Error saving expense:", error);
        throw error;
    }
}

export async function getReportingData() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const [invoicesSnap, expensesSnap] = await Promise.all([
            getDocs(query(collection(db, "invoices"), where("ownerId", "==", user.uid))),
            getDocs(query(collection(db, "expenses"), where("ownerId", "==", user.uid)))
        ]);

        const invoices = invoicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
        const expenses = expensesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));

        const paidInvoices = invoices.filter(inv => inv.status === 'paid');
        const totalIncome = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const netProfit = totalIncome - totalExpenses;

        // Group by category for charts
        const expenseCategories: Record<string, number> = {};
        expenses.forEach(exp => {
            expenseCategories[exp.category] = (expenseCategories[exp.category] || 0) + exp.amount;
        });

        // Group by month for chart (last 6 months)
        const monthlyData: Record<string, { income: number; expenses: number }> = {};
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short' });
            months.push(key);
            monthlyData[key] = { income: 0, expenses: 0 };
        }

        paidInvoices.forEach(inv => {
            const m = new Date(inv.createdAt).toLocaleString('default', { month: 'short' });
            if (monthlyData[m]) monthlyData[m].income += inv.total;
        });

        expenses.forEach(exp => {
            const m = new Date(exp.date).toLocaleString('default', { month: 'short' });
            if (monthlyData[m]) monthlyData[m].expenses += exp.amount;
        });

        return {
            totalIncome,
            totalExpenses,
            netProfit,
            expenseCategories: Object.entries(expenseCategories).map(([name, value]) => ({ name, value })),
            monthlyData: months.map(name => ({ name, ...monthlyData[name] })),
            estimatedTax: Math.max(0, netProfit * 0.15) // Placeholder 15% rate
        };
    } catch (error) {
        console.error("Error fetching reporting data:", error);
        return null;
    }
}

export async function getRecentProjects(count: number = 3) {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(
            collection(db, "projects"),
            where("ownerId", "==", user.uid),
            orderBy("updatedAt", "desc"),
            limit(count)
        );
        const snap = await getDocs(q);
        const projects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

        const contactsMap: Record<string, string> = {};
        const contactIds = Array.from(new Set(projects.map(p => p.contactId).filter(Boolean)));
        
        if (contactIds.length > 0) {
            const cSnap = await getDocs(query(collection(db, "contacts"), where("ownerId", "==", user.uid)));
            cSnap.forEach(doc => contactsMap[doc.id] = doc.data().name);
        }

        return projects.map(p => ({
            ...p,
            contactName: p.contactId ? contactsMap[p.contactId] : undefined
        }));
    } catch (error) {
        console.error("Error fetching recent projects:", error);
        const snap = await getDocs(query(collection(db, "projects"), where("ownerId", "==", user.uid)));
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        return all.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).slice(0, count);
    }
}

export async function getTasks() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(
            collection(db, "tasks"),
            where("ownerId", "==", user.uid),
            where("completed", "==", false),
            orderBy("createdAt", "asc")
        );
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        const snap = await getDocs(query(collection(db, "tasks"), where("ownerId", "==", user.uid)));
        return (snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)))
            .filter(t => !t.completed)
            .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    }
}

export async function saveTask(taskData: Partial<Task>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Unauthorized");

    try {
        const data = {
            ...taskData,
            ownerId: user.uid,
            completed: taskData.completed ?? false,
            createdAt: taskData.createdAt || new Date().toISOString()
        };

        if (taskData.id) {
            const ref = fsDoc(db, "tasks", taskData.id);
            await updateDoc(ref, data);
            return taskData.id;
        } else {
            const ref = collection(db, "tasks");
            const res = await addDoc(ref, data);
            return res.id;
        }
    } catch (error) {
        console.error("Error saving task:", error);
        throw error;
    }
}
