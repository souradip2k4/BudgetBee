import { EntryTable } from "@/components/entry-table";
import { currentUser } from "@clerk/nextjs/server";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import axios from "axios";

export default async function Page() {
	const user = await currentUser();
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["entries", user?.id],
		queryFn: async () => {
			if (!user) {
				return [];
			}
			const res = await axios.get(`/api/users/${user?.id}/entries`);
			return res.data;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EntryTable />
		</HydrationBoundary>
	);
}
