"use client";

import LoadingSection from "@/components/loading-section";
import { QueryEntries } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable, columns } from "./data-table";

export function EntryTable() {
	const { user } = useUser();
	const query = useQuery<any, any, QueryEntries>({
		queryKey: ["entries", user?.id],
		queryFn: async () => {
			if (!user) {
				return [];
			}
			const res = await axios.get(`/api/users/${user?.id}/entries`);
			return res.data;
		},
	});

	if (query.isLoading) return <LoadingSection />;
	else if (query.isError) throw new Error(query.error);
	else if (query.data === undefined) return <LoadingSection />;

	return (
		<div>
			<DataTable columns={columns} data={query.data ?? []} />
		</div>
	);
}
