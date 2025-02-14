import ApiKeysList from "@/components/api-keys-list";
import { ApiKeysResoponse } from "@/lib/api";
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
		queryKey: ["api-keys", user?.id],
		queryFn: async () => {
			if (!user?.id) return null;
			const res = await axios.get(`/api/users/${user?.id}/api-keys`);
			return res.data as ApiKeysResoponse;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="px-8 pt-8">
				<ApiKeysList />
			</div>
		</HydrationBoundary>
	);
}
