import React from "react";
import { Card, CardTitle } from "../ui/card";
import EasyCollaborationImg from "@/public/images/easy_collaboration.png"
import AnalyticsImg from "@/public/images/analytics.png"
import MonthlyAnalyticsImg from "@/public/images/monthly_analytics.png"
import InvoiceImg from "@/public/images/invoice.png"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { H1 } from "../ui/typography";

function BentoGridItem({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("flex bg-[#161616] bg-accent/10 items-center justify-center flex-col gap-4 text-center rounded-xl border p-4 md:p-8 ", className)}>{children}</div>
    )
}

export function BentoGrid() {
    return (
        <div className="w-full border-b flex flex-col items-center justify-center gap-8 border-t px-4 py-8 lg:px-36 lg:py-24">
            <h1 className="text-4xl text-muted-foreground">The <span className="text-white">easy</span> way to track expenses.</h1>
            <div className="grid gap-6 md:grid-rows-3 grid-cols-1 md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-4">
                <BentoGridItem className="md:order-1">
                    <h2 className="text-xl">Gain valuable insights</h2>
                    <p className="text-muted-foreground">Our analytics tools make it easier for you to vizualize your data and gain insights you never had before.</p>
                    <img src={AnalyticsImg.src} />
                </BentoGridItem>

                <BentoGridItem className="lg:col-span-2 md:order-3 lg:order-2">
                    <h2 className="text-2xl">Track your finances</h2>
                    <img src={MonthlyAnalyticsImg.src} />
                </BentoGridItem>
                <BentoGridItem className="md:order-2 lg:order-3">
                    <h2 className="text-xl">Easy collaboration</h2>
                    <p className="text-muted-foreground">Seemly collaborate across an entire team with ease.</p>
                    <img src={EasyCollaborationImg.src} />
                </BentoGridItem>
                <BentoGridItem className="lg:col-span-2 md:order-4">
                    <img src={InvoiceImg.src} />
                </BentoGridItem>
                <BentoGridItem className="p-8 md:p-16 lg:col-span-2 items-start text-start md:order-5">
                    <h2 className="text-4xl">Ready to start tracking?</h2>
                    <p className="text-lg text-muted-foreground">Bring harmony to team expenses with budget limits and
                        real-time monitiring. Freedom for your staff. Peace of
                        mind for you.</p>
                    <Button size="lg">Get started - it&apos;s free</Button>
                </BentoGridItem>
            </div>
        </div>
    )
}
