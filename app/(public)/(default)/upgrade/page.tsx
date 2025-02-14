"use client"

import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe/client";
import { checkoutWithStripe } from "@/lib/stripe/server";

export default function Page() {
    const handleClick = async () => {
        const session = await checkoutWithStripe("price_1QH8viSDBHop204nlMXfCuX8")
        if (!session || !session.sessionId) { return }

        const stripe = await getStripe()
        stripe?.redirectToCheckout({ sessionId: session.sessionId })
    }

    return (
        <div>
            <Button onClick={handleClick}>Pay with Stripe</Button>
        </div>
    )
}
