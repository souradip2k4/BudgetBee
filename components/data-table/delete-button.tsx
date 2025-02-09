import { Button } from "@/components/ui/button";
import { QueryEntry } from "@/lib/api";
import { deleteEntryMutationFn } from "@/lib/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";

export function DeleteButton({ row }: { row: Row<QueryEntry> }) {
	const queryClient = useQueryClient();
	const deleteEntryMutation = useMutation({
		mutationFn: deleteEntryMutationFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			queryClient.refetchQueries({ queryKey: ["entries"] });
		},
	});

	return (
		<Button
			size="sm"
			variant="ghost"
			className="w-full justify-start"
			onClick={() => deleteEntryMutation.mutate(row.original.id)}>
			{deleteEntryMutation.isPending ? "Deleting..." : "Delete"}
		</Button>
	);
}
