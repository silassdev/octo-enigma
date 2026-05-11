export interface User {
    id: string;
    displayName: string;
    email: string;
    stripeCustomerId?: string;
    plan: 'free' | 'pro' | 'lifetime';
    role: 'admin' | 'user';
    subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'grace_period';
    onboardingCompleted?: boolean;
    createdAt: any;
}

export interface Contact {
    id: string;
    ownerId: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    tags: string[];
    status: 'lead' | 'client' | 'archived';
    notes?: string;
    createdAt: any;
    lastContactedAt?: any;
}

export interface Project {
    id: string;
    ownerId: string;
    title: string;
    contactId: string;
    description?: string;
    status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
    budget?: number;
    deadline?: any;
    progress?: number;
    createdAt: any;
    updatedAt: string;
}

export interface Task {
    id: string;
    label: string;
    time: string; // "10:30 AM" or "Tomorrow"
    type: 'high' | 'medium' | 'low';
    completed: boolean;
    ownerId: string;
    createdAt: string;
}

export interface Invoice {
    id: string;
    ownerId: string;
    contactId: string;
    projectId?: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    pdfUrl?: string;
    dueDate: any;
    createdAt: any;
}

export interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Expense {
    id: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
    projectId?: string;
    contactId?: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Ticket {
    id: string;
    ownerId: string;
    subject: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
}

export interface AttentionItem {
    id: string;
    type: 'invoice' | 'project';
    title: string;
    reason: string;
    severity: 'high' | 'medium' | 'low';
    link: string;
}
