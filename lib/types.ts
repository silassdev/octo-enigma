export interface User {
    id: string;
    displayName: string;
    email: string;
    stripeCustomerId?: string;
    plan: 'free' | 'pro';
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
    dueDate?: any;
    createdAt: any;
}

export interface Task {
    id: string;
    ownerId: string;
    projectId: string;
    title: string;
    description?: string;
    dueDate?: any;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: any;
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
}

export interface Expense {
    id: string;
    ownerId: string;
    contactId?: string;
    projectId?: string;
    amount: number;
    date: any;
    category: string;
    notes?: string;
    receiptUrl?: string;
    ocrData?: any;
    createdAt: any;
}
