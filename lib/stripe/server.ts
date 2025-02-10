"use server";

import { stripe } from "@/lib/stripe/config";
import { url } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const checkoutWithStripe = async (priceId: string) => {
	const user = await clerkClient.users.getUser("");
	const customer = await stripe.customers.create(
		{
			name: user.fullName ?? "",
			email: user.primaryEmailAddress?.emailAddress,
		},
		{ maxNetworkRetries: 1, idempotencyKey: user.id },
	);

	let params: Stripe.Checkout.SessionCreateParams = {
		allow_promotion_codes: true,
		billing_address_collection: "required",
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
		cancel_url: url().toString(),
		success_url: url("/thank-you/").toString(),
		mode: "subscription",
	};

	// Create a checkout session in Stripe
	let session;
	try {
		session = await stripe.checkout.sessions.create(params);
	} catch (err) {
		console.error(err);
		throw new Error("Unable to create checkout session.");
	}

	// Instead of returning a Response, just return the data or error.
	if (session) {
		return { sessionId: session.id };
	} else {
		throw new Error("Unable to create checkout session.");
	}
};
