import Stripe from "stripe";
import { url } from "../utils";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
	// https://github.com/stripe/stripe-node#configuration
	// https://stripe.com/docs/api/versioning
	apiVersion: "2024-10-28.acacia",
	// Register this as an official Stripe plugin.
	// https://stripe.com/docs/building-plugins#setappinfo
	appInfo: {
		name: "Budgetbee",
		url: url("/").toString(),
	},
});
