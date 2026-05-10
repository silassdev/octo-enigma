import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET() {
    try {
        if (!adminAuth || !adminDb) {
            return NextResponse.json({ success: false, error: "Firebase Admin not initialized. Check your environment variables." }, { status: 500 });
        }

        if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
            return NextResponse.json({ success: false, error: "Missing environment variables" }, { status: 500 });
        }
        const email = process.env.SEED_ADMIN_EMAIL;
        const password = process.env.SEED_ADMIN_PASSWORD;

        // 1. Create or get user
        let user;
        try {
            user = await adminAuth.getUserByEmail(email);
        } catch (e) {
            user = await adminAuth.createUser({
                email,
                password,
                displayName: "System Admin",
            });
        }

        // 2. Set Admin Role & Pro Plan in Firestore
        await adminDb.collection('users').doc(user.uid).set({
            id: user.uid,
            displayName: "System Admin",
            email,
            plan: 'pro',
            role: 'admin',
            subscriptionStatus: 'active',
            onboardingCompleted: true,
            createdAt: new Date().toISOString()
        }, { merge: true });

        return NextResponse.json({
            success: true,
            message: "Admin seeded successfully",
            credentials: { email, password }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
