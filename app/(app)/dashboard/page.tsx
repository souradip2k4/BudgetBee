import Dashboard from "@/components/dashboard";
import { QueryCategories } from "@/lib/api";
import { entriesQueryFn } from "@/lib/query";
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
        queryKey: ["entries", user?.id],
        queryFn: entriesQueryFn,
    });

    await queryClient.prefetchQuery({
        queryKey: ["category"],
        queryFn: async () => {
            if (!user?.id) return [] as QueryCategories;
            const res = await axios.get(`/api/users/${user?.id}/categories`);
            return res.data as QueryCategories;
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Dashboard />
        </HydrationBoundary>
    );
}
