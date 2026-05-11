import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && adminDb) {
      await adminDb.collection("users").doc(userId).update({
        plan: plan,
        subscriptionStatus: "active",
        stripeCustomerId: session.customer as string,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
