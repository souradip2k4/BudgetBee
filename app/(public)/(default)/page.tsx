import { PricingCardGroup } from "@/components/pricing";
import { BentoGrid } from "@/components/section/bento-grid";
import { Button } from "@/components/ui/button";
import BudgetbeeDashboardImg from "@/public/images/budgetbee_dashboard.png";
import DataSetsImg from "@/public/images/datasets.webp";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Page() {
    return (
        <main>
            <div className="flex flex-col justify-center gap-4 px-8 py-16 lg:items-center">
                <h1 className="hidden items-center text-2xl text-muted-foreground lg:flex lg:text-5xl">
                    Seemlessly track your
                    <span className="text-slider text-white">
                        <span className="text-slider__word">finances</span>
                        <span className="text-slider__word">expense</span>
                        <span className="text-slider__word">subscriptions</span>
                    </span>
                </h1>
                <h1 className="text-2xl lg:hidden">
                    Seemlessly track your finances
                </h1>
                <p className="text-lg text-muted-foreground lg:w-1/2 lg:text-center">
                    Do you find managing your finances{" "}
                    <span className="text-primary-foreground">tedious</span> and
                    <span className="text-primary-foreground"> difficult</span>?
                    With budgetbee you can track your spendings and gain
                    valuable <span className="text-white">insights</span>.
                </p>
                <div className="mt-4 lg:flex">
                    <SignedIn>
                        <Button
                            className="group mb-4 w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                            asChild>
                            <Link href="/dashboard">
                                Open dashboard
                                <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                                    🡒
                                </span>
                            </Link>
                        </Button>
                    </SignedIn>
                    <SignedOut>
                        <Button
                            className="group mb-4 w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                            asChild>
                            <Link href="/join">
                                Get started
                                <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                                    🡒
                                </span>
                            </Link>
                        </Button>
                        <Button
                            className="relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] sm:ml-4 sm:w-auto"
                            asChild>
                            <Link href="/blogs/getting-started">
                                Learn more
                            </Link>
                        </Button>
                    </SignedOut>
                </div>

                <div className="mt-4 w-full rounded-md bg-black/20 p-4 lg:w-2/3">
                    <img
                        src={BudgetbeeDashboardImg.src}
                        className="h-auto w-full rounded-md"
                    />
                </div>
            </div>

            {/** BENTO GRID SECTION **/}
            <BentoGrid />

            <div className="flex flex-col items-center justify-center space-y-4 px-4 py-8 lg:space-y-8 lg:px-8 lg:py-24">
                <h1 className="text-2xl text-muted-foreground lg:text-5xl">
                    One <span className="text-white">flexible pricing</span> for
                    all.
                </h1>
                <PricingCardGroup />
            </div>
        </main>
    );
}
