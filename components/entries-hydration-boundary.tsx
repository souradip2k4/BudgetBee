import { entriesQueryFn } from "@/lib/query";
import { currentUser } from "@clerk/nextjs/server";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import React from "react";

export default async function EntriesHydrationBoundary({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient();
	const user = await currentUser();

	await queryClient.prefetchQuery({
		queryKey: [
			"entries",
			user?.id,
			{ from: "2024-04-01", to: "2024-04-30" },
		],
		queryFn: entriesQueryFn,
	});
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{children}
		</HydrationBoundary>
	);
}
