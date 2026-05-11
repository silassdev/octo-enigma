import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const plan = searchParams.get("plan");

    if (!userId || !plan || !adminDb) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    }

    try {
        // Mocking what the Stripe Webhook would do:
        await adminDb.collection("users").doc(userId).update({
            plan: plan,
            updatedAt: new Date().toISOString()
        });

        console.log(`[TEST MODE] Successfully upgraded user ${userId} to ${plan}`);
        
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing/success?session_id=mock_session_${Date.now()}`
        );
    } catch (error) {
        console.error("[TEST MODE] Mock success error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    }
}
