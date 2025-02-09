import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { editEntryMutationFn } from "@/lib/actions";
import { QueryEntry } from "@/lib/api";
import { castUndefined, cn } from "@/lib/utils";
import { categoriesAtom } from "@/store/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { useImperativeHandle, useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { z } from "zod";

type EntryFormRef = { submit: () => void; reset: () => void };

function EditForm({
	row,
	formRef,
}: {
	row: Row<QueryEntry>;
	formRef: React.Ref<EntryFormRef | null>;
}) {
	const queryClient = useQueryClient();
	const categories = useRecoilValue(categoriesAtom);
	const editEntryMutation = useMutation<
		unknown,
		unknown,
		{
			id: string;
			amount: number | null;
			message: string | null;
			category_id: string | null;
			date?: Date;
		}
	>({
		mutationFn: editEntryMutationFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			queryClient.refetchQueries({ queryKey: ["entries"] });
		},
	});
	const entry = row.original;
	const entrySchema = z.object({
		amount: z.number().nullable(),
		message: z.string().nullable(),
		date: z.date().optional(),
		category_id: z.string().nullable(),
	});
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<{
		amount: number;
		message: string | null;
		category_id: string | null;
		date?: Date;
	}>({
		defaultValues: {
			amount: entry.amount,
			message: entry.message,
			category_id: entry.category_id,
			date: new Date(entry.date),
		},
		resolver: zodResolver(entrySchema),
	});
	const onSubmit = (e: FieldValues) => {
		const data = entrySchema.safeParse(e);
		if (!entry.id || !data.success) return;

		const { amount, message, category_id, date } = data.data;
		editEntryMutation.mutate({
			id: entry.id,
			amount,
			message,
			category_id,
			date,
		});
	};

	useImperativeHandle(formRef, () => ({
		submit: () => {
			handleSubmit(onSubmit)();
		},
		reset: reset,
	}));

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-2 max-md:px-4">
			<div>
				<Label htmlFor="amount">Amount</Label>
				<Input
					type="number"
					placeholder="Amount"
					{...register("amount", { valueAsNumber: true })}
				/>
			</div>

			<div>
				<Label htmlFor="message">Message</Label>
				<Input placeholder="Message" {...register("message")} />
			</div>

			<div>
				<Label htmlFor="date">Date</Label>
				<Controller
					name="date"
					control={control}
					render={({ field: { value, onChange, onBlur } }) => (
						<Popover modal>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-full justify-start text-left font-normal",
										!value && "text-muted-foreground",
									)}>
									{value ?
										format(new Date(value), "PPP")
									:	<span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={castUndefined(value)}
									onSelect={onChange}
									onDayBlur={onBlur}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					)}
				/>
			</div>

			<div>
				<Label htmlFor="category_id">Category</Label>
				<Controller
					name="category_id"
					control={control}
					render={({ field: { onChange } }) => (
						<Select onValueChange={onChange}>
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									{!categories && <p>Loading...</p>}
									{categories &&
										categories.map(value => (
											<SelectItem
												value={value.id}
												key={value.id}>
												{value.name}
											</SelectItem>
										))}
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
				/>
			</div>
		</form>
	);
}

export function EditButton({ row }: { row: Row<QueryEntry> }) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const formRef = useRef<EntryFormRef | null>(null);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						size="sm"
						variant="ghost"
						className="w-full justify-start">
						Edit
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit entry</DialogTitle>
						<DialogDescription>
							Click save changes when you&apos;re done.
						</DialogDescription>
					</DialogHeader>

					<EditForm row={row} formRef={formRef} />

					<DialogFooter>
						<DialogClose asChild>
							<Button
								variant="outline"
								onClick={() => formRef.current?.reset()}
								className="mt-4">
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							onClick={() => formRef.current?.submit()}
							className="mt-4">
							Save changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					size="sm"
					variant="ghost"
					className="w-full justify-start">
					Edit
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Edit entry</DrawerTitle>
					<DrawerDescription>
						Click save changes when you&apos;re done.
					</DrawerDescription>
				</DrawerHeader>

				<EditForm row={row} formRef={formRef} />

				<DrawerFooter>
					<DrawerClose asChild>
						<Button
							variant="outline"
							onClick={() => formRef.current?.reset()}>
							Cancel
						</Button>
					</DrawerClose>
					<Button
						type="submit"
						onClick={() => formRef.current?.submit()}>
						Save changes
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
