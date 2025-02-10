"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BudgetbeeLogo } from "./logo";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const links: { name: string; href: string | URL }[] = [
	{ name: "Overview", href: "/overview" },
	{ name: "Pricing", href: "/pricing" },
	{ name: "About", href: "/about" },
	{ name: "Support", href: "/support" },
];

export function Navbar() {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	return (
		<div className="flex h-[56px] items-center justify-between border-b px-2 md:px-8">
			<BudgetbeeLogo />
			{isDesktop && (
				<React.Fragment>
					<div className="hidden gap-4 text-sm text-[#A3A3A3] lg:flex [&>a:hover]:text-white">
						{links.map((link, index) => (
							<React.Fragment key={index}>
								<Link href={link.href}>{link.name}</Link>
							</React.Fragment>
						))}
					</div>
					<div className="hidden space-x-2 lg:block">
						<SignedOut>
							<Button asChild size="sm" variant="secondary">
								<Link href="/login">Login</Link>
							</Button>
							<Button size="sm" asChild>
								<Link href="/join">Signup</Link>
							</Button>
						</SignedOut>
						<SignedIn>
							<Button asChild size="sm" variant="secondary">
								<Link href="/dashboard">Dashboard</Link>
							</Button>
						</SignedIn>
					</div>
				</React.Fragment>
			)}

			{!isDesktop && (
				<DropdownMenu modal>
					<DropdownMenuTrigger asChild>
						<Button size="icon" variant="outline">
							<Menu className="size-4" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuPortal>
						<DropdownMenuContent>
							{links.map((link, index) => (
								<DropdownMenuItem key={index}>
									<Link href={link.href}>{link.name}</Link>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem>Login</DropdownMenuItem>
							<DropdownMenuItem>Signin</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			)}
		</div>
	);
}
