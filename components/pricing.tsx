import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import React, { ReactNode } from "react";

type PricingOption = {
    title: string;
    price:
    | string
    | { amount: number; validity: "monthly" | "lifetime" | "yearly" };
    description: string;
    perks: string[];
    redirect?: string;
    highlight?: boolean;
    disabled?: boolean;
};

const options: PricingOption[] = [
    {
        title: "Free",
        price: { amount: 0, validity: "monthly" },
        description: "Basic features for individual use.",
        perks: ["10,000 entries", "1 user", "1 workspace", "100 workflow runs (coming soon)"],
    },
    {
        title: "Pro",
        price: { amount: 10, validity: "monthly" },
        description: "More advanced features (coming soon)",
        perks: [
            "Unlimited entries",
            "5 users",
            "3 workspaces",
            "10,000 workflow runs (coming soon)",
        ],
        disabled: true,
    },
    {
        highlight: true,
        title: "Lifetime",
        price: { amount: 119, validity: "lifetime" },
        description: "Limited time plan for lifetime usage.",
        perks: [
            "Unlimited entries",
            "1 users",
            "1 workspace",
            "10,000 monthly workflow runs (coming soon)",
        ],
    },
    {
        title: "Enterprise",
        price: "Custom Pricing",
        description: "Custom solution for large enterprises.",
        perks: [
            "All features in Pro tier",
            "More users",
            "More workflow runs",
            "Custom integrations",
            "Advanced security",
        ],
    },
];

export function PricingCardGroup() {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
            {options.map((option, index) => {
                const { title, price, description, perks, highlight } = option;
                return (
                    <React.Fragment key={index}>
                        <div
                            className={cn(
                                "flex flex-col items-start gap-4 rounded-lg p-8 lg:max-w-[360px]",
                                { "pricing-card__hightlight": highlight },
                            )}>
                            <Button size="icon" variant="outline" disabled>
                                <Sparkles className="h-4 w-4" />
                            </Button>
                            <div className="space-y-2 mb-4">
                                <div className="flex gap-2">
                                    <h2 className="text-xl">{title}</h2>
                                </div>
                                <p className="text-[#A3A3A3] line-clamp-1">{description}</p>
                            </div>
                            {typeof price === "string" && (
                                <h1 className="text-2xl">{price}</h1>
                            )}
                            {typeof price !== "string" && (
                                <h1 className="text-2xl">
                                    ${price.amount}
                                    {price.validity === "monthly" && (
                                        <span className="text-sm text-muted-foreground">
                                            {" /month"}
                                        </span>
                                    )}
                                    {price.validity === "yearly" && (
                                        <span className="text-sm text-muted-foreground">
                                            {" /year"}
                                        </span>
                                    )}
                                </h1>
                            )}
                            <Separator className={cn({ "bg-white/10": title === "Lifetime" })} />
                            <div className="grow space-y-4 gap-4">
                                {perks.map((perk, index) => (
                                    <React.Fragment key={index}>
                                        <p className="text-sm text-[#A3A3A3] line-clamp-1">
                                            ✦ &nbsp;{perk}
                                        </p>
                                    </React.Fragment>
                                ))}
                            </div>
                            <Button
                                className="w-full"
                                disabled={option.disabled}
                                variant={
                                    title === "Lifetime" ? "default" : (
                                        "secondary"
                                    )
                                }>
                                Get started
                            </Button>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
