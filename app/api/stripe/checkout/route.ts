import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { plan, email, userId, test } = await req.json();

    // 1. Simulation Mode (for testing without real Price IDs)
    if (test || process.env.NODE_ENV === 'development') {
      console.log(`[MOCK] Simulating checkout for ${plan} plan`);
      return NextResponse.json({ 
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/mock-success?userId=${userId}&plan=${plan}` 
      });
    }

    const prices: Record<string, string> = {
      pro: "price_PRO_PLAN_ID", 
      lifetime: "price_LIFETIME_PLAN_ID",
    };

    if (prices[plan] && prices[plan].includes("_PLAN_ID")) {
      return NextResponse.json({ 
        error: `Stripe Price ID for '${plan}' is not configured. Please add your real Price IDs to app/api/stripe/checkout/route.ts or run in dev mode.` 
      }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      mode: plan === "lifetime" ? "payment" : "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing/cancel`,
      customer_email: email,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
