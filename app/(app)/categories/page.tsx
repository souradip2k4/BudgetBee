import Category from "@/components/pages/category";
import Tag from "@/components/pages/tag";
import { QueryCategory, QueryTags } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import axios from "axios";

export default async function Page() {
	const queryClient = new QueryClient();
	const user = await currentUser();

	await queryClient.prefetchQuery({
		queryKey: ["category", user?.id],
		queryFn: async () => {
			if (!user?.id) return null;
			const res = await axios.get(`/api/users/${user?.id}/categories`);
			return res.data as QueryCategory;
		},
	});

	await queryClient.prefetchQuery({
		queryKey: ["tag", user?.id],
		queryFn: async () => {
			if (!user?.id) return null;
			const res = await axios.get(`/api/users/${user?.id}/tags`);
			return res.data as QueryTags;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="space-y-8 px-8 py-8">
				<Category />
				<Tag />
			</div>
		</HydrationBoundary>
	);
}
