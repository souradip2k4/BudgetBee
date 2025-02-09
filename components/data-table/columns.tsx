"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QueryEntry } from "@/lib/api";
import { cn } from "@/lib/utils";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import React from "react";

export type Entry = QueryEntry;

const MessageCell = ({ row }: { row: Row<Entry> }) => {
	const message = row.getValue("message") as string;
	return (
		<div className="min-w-[200px]">
			<p className="line-clamp-2 text-ellipsis">{message}</p>
		</div>
	);
};

const CategoryCell = ({ row }: { row: Row<Entry> }) => {
	const category = row.original.category;
	return (
		<React.Fragment>
			{category && (
				<Badge variant="outline" key={category?.id}>
					{category?.name}
				</Badge>
			)}
		</React.Fragment>
	);
};

const TagsCell = ({ row }: { row: Row<Entry> }) => {
	const tagc = 2; // no of tags to display
	return (
		<div className="flex flex-wrap gap-1">
			{row.original.tags.map((value, index) => {
				if (index + 1 <= tagc) {
					return (
						<Badge variant="outline" key={value.id}>
							{value.name}
						</Badge>
					);
				}
			})}
			{row.original.tags.length > tagc && (
				<p className="text-xs">+{row.original.tags.length - tagc}</p>
			)}
		</div>
	);
};

export const columns: ColumnDef<Entry>[] = [
	/*{
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }, */
	{
		accessorKey: "amount",
		header: () => <div className="text-right">Amount</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "INR",
			}).format(amount);
			const color =
				amount > 0 ? "text-green-600 dark:text-green-500"
				: amount < 0 ? "text-red-600 dark:text-[#EE0000]"
				: "";
			return (
				<div className={cn("text-right font-medium", color)}>
					<p className="whitespace-nowrap">{formatted}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "message",
		header: "Message",
		cell: MessageCell,
	},
	{
		accessorKey: "date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}>
					Date
					{column.getIsSorted() === "asc" ?
						<IconArrowUp className="ml-2 h-4 w-4" />
					:	<IconArrowDown className="ml-2 h-4 w-4" />}
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue("date"));
			return (
				<p className="text-muted-foreground">{date.toDateString()}</p>
			);
		},
	},
	/*{
		accessorKey: "category",
		header: "Category",
		cell: CategoryCell,
	},
	{
		accessorKey: "tags",
		header: "Tags",
		cell: TagsCell,
	},*/
];
