import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const email = "admin@microcrm.io";
        const password = "AdminPassword123!";

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
