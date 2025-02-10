"use client";

import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PanelLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BudgetbeeLogo } from "./logo";

function NavItemGroup({
    text,
    children,
}: {
    text?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full flex-col items-start pt-4 sm:px-4">
            {text && (
                <p className="px-4 py-1 text-sm text-muted-foreground max-sm:px-2">
                    {text}
                </p>
            )}
            {children}
        </div>
    );
}

function NavItem({ href, text }: { href: string; text: string }) {
    return (
        <Link
            className="inline-flex w-full items-center justify-start gap-1 rounded-sm px-4 py-2 hover:bg-accent max-sm:px-2"
            href={href}>
            {text}
        </Link>
    );
}

export function Sidebar() {
    return (
        <ScrollArea className="h-[calc(100vh-56px)] max-md:h-screen">
            <NavItemGroup>
                <NavItem href={"/dashboard"} text={"Dashboard"} />
            </NavItemGroup>

            <NavItemGroup text="Components">
                <NavItem href={"/entries"} text={"Entry"} />
               {/* <NavItem href={"/categories"} text={"Category"} />
                <NavItem href={"/tags"} text={"Tag"} />*/}
            </NavItemGroup>

            {/*<NavItemGroup text="Developers">
                <NavItem href={"/automation"} text={"Automation"} />
                <NavItem href={"/tokens"} text={"Tokens"} />
            </NavItemGroup>*/}

            <NavItemGroup text="Settings">
                <NavItem href={"/settings"} text={"Settings"} />
                <NavItem href={"/account"} text={"Accounts"} />
                {/*<NavItem href={"/billing"} text={"Billing"} />*/}
            </NavItemGroup>
        </ScrollArea>
    );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
    const isDesktop = useMediaQuery("(min-width: 768px)", {
        defaultValue: false,
    });

    if (!isDesktop) {
        return (
            <div>
                <div className="flex h-[56px] items-center justify-start gap-4 border-b px-8 max-sm:px-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline">
                                <PanelLeft size={16} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="px-4">
                            <SheetHeader>
                                <Sidebar />
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                    <BudgetbeeLogo />
                </div>

                <div className="px-4 py-8">{children}</div>
            </div>
        );
    }

    return (
        <ResizablePanelGroup className="fixed" direction="horizontal">
            <ResizablePanel defaultSize={15}>
                <div className="bg-accent/20">
                    <div className="flex h-[56px] items-center justify-between border-b px-8">
                        <BudgetbeeLogo />
                    </div>
                    <Sidebar />
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <div className="max-h-full overflow-auto p-8">
                    {children}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
