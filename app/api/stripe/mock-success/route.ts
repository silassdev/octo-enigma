import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const plan = searchParams.get("plan");
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!userId || !plan) {
        return NextResponse.redirect(`${appUrl}/dashboard`);
    }

    try {
        if (adminDb) {
            // Mocking what the Stripe Webhook would do:
            await adminDb.collection("users").doc(userId).update({
                plan: plan,
                updatedAt: new Date().toISOString()
            });
            console.log(`[TEST MODE] Successfully upgraded user ${userId} to ${plan} via Admin SDK`);
        } else {
            console.warn(`[TEST MODE] adminDb not initialized. Make sure you've added your service account credentials. Could not upgrade plan for ${userId}.`);
        }
        
        return NextResponse.redirect(
            `${appUrl}/dashboard/settings/billing/success?session_id=mock_session_${Date.now()}`
        );
    } catch (error) {
        console.error("[TEST MODE] Mock success error:", error);
        return NextResponse.redirect(`${appUrl}/dashboard`);
    }
}
