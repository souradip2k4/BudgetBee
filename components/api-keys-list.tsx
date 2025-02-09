"use client";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ApiKeysResoponse } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { H3 } from "./ui/typography";

export default function ApiKeysList() {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const apiKeysQuery = useQuery({
		queryKey: ["query", user?.id],
		queryFn: async () => {
			if (!user?.id) return null;
			const res = await axios.get(`/api/users/${user?.id}/api-keys`);
			return res.data as ApiKeysResoponse;
		},
	});

	const apiKeysMutation = useMutation({
		mutationKey: ["query", user?.id, "new"],
		mutationFn: async () => {
			if (!user?.id) return null;
			await axios.post(`/api/api-keys/${user?.id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["query", user?.id] });
			queryClient.refetchQueries({ queryKey: ["query", user?.id] });
		},
	});

	if (apiKeysQuery.isError) return <>{apiKeysQuery.error.message}</>;
	if (apiKeysQuery.isLoading) return <>Loading...</>;
	if (!apiKeysQuery.data) return <>undef</>;

	return (
		<div className="space-y-8">
			<H3 className="mt-0">API Keys</H3>
			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Permissions</TableHead>
							<TableHead>Expiry</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{apiKeysQuery.data.data.map(key => (
							<TableRow key={key.id}>
								<TableCell className="font-medium">
									{key.key}
								</TableCell>
								<TableCell>
									{new Date().toDateString()}
								</TableCell>
								<TableCell>All</TableCell>
								<TableCell>No Expiry</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Button size="icon" variant="outline">
											<Copy className="size-4" />
										</Button>
										<Button size="icon" variant="outline">
											<Trash2 className="size-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog>
				<DialogTrigger>
					<Button>New API Key</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New API Key.</DialogTitle>
					</DialogHeader>
					<Input placeholder="Name" />
					<DialogFooter>
						<Button>Create</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Button
				onClick={() => {
					apiKeysMutation.mutate();
				}}>
				Create new API Key
			</Button>
		</div>
	);
}
