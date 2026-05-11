import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message, userId } = body;

        if (!adminDb) {
            return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
        }

        // Store the contact request in Firestore
        await adminDb.collection("contact_requests").add({
            name,
            email,
            subject,
            message,
            userId: userId || "anonymous",
            createdAt: new Date().toISOString(),
            status: "new"
        });

        return NextResponse.json({ success: true, message: "Message sent successfully" });
    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
