import { stripe } from "@/lib/stripe/config";
import { manageSubscriptionStatusChange } from "@/utils/supabase/admin";
import Stripe from "stripe";

const relevantEvents = new Set([
	"checkout.session.completed",
	"customer.subscription.created",
	"customer.subscription.updated",
	"customer.subscription.deleted",
]);

export async function POST(req: Request) {
	const body = await req.text();
	const sig = req.headers.get("stripe-signature") as string;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	let event: Stripe.Event;

	try {
		if (!sig || !webhookSecret) {
			return new Response("Webhook secret not found.", { status: 400 });
		}
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
		console.log(`[api] Webhook received: ${event.type}`);
	} catch (err: any) {
		console.log(`[api] Webhook error: ${err.message}`);
		return new Response(`Webhook error: ${err.message}`, { status: 400 });
	}

	if (relevantEvents.has(event.type)) {
		try {
			switch (event.type) {
				case "checkout.session.completed":
					const checkoutSession = event.data
						.object as Stripe.Checkout.Session;
					if (checkoutSession.mode === "subscription") {
						const subscriptionId = checkoutSession.subscription;
						await manageSubscriptionStatusChange(
							subscriptionId as string,
							checkoutSession.customer as string,
							true,
						);
					}
					break;
				case "customer.subscription.created":
					const subscription = event.data.object;
				default:
					throw new Error("Unhandled relevant event!");
			}
		} catch (error) {
			console.log(error);
			return new Response("Webhook handler failed.", {
				status: 400,
			});
		}
	} else {
		console.log(`[api] Unsupported event type: ${event.type}`);
		return new Response(`Unsupported event type: ${event.type}`, {
			status: 400,
		});
	}
	return new Response(JSON.stringify({ received: true }));
}
