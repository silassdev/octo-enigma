import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { notifyAdminOfNewContact } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message, userId } = body;

        if (!adminDb) {
            return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
        }

        const contactData = {
            name,
            email,
            subject,
            message,
            userId: userId || "anonymous",
            createdAt: new Date().toISOString(),
            status: "open"
        };

        // Store the contact request in Firestore
        await adminDb.collection("contact_requests").add(contactData);
        
        // Trigger automated admin notification
        await notifyAdminOfNewContact(contactData);

        return NextResponse.json({ success: true, message: "Message sent successfully" });
    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
