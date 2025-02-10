"use client";

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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { entriesMutationFn } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { entryAtom } from "@/store/atoms";
import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { IconCalendarPlus, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { nanoid } from "nanoid";
import React, {
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Control, FieldValues, useController, useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";

export function DatePicker({
	index,
	control,
}: {
	index: number;
	control: Control;
}) {
	const entries = useRecoilValue(entryAtom);
	const uuid = entries[index];
	const { field: dateField } = useController({
		name: uuid.concat(".date"),
		control,
		defaultValue: new Date(),
	});
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"justify-start text-left font-normal",
						!dateField.value && "text-muted-foreground",
					)}>
					<IconCalendarPlus className="mr-2 h-4 w-4" />
					{dateField.value ?
						format(dateField.value, "PPP")
					:	<span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="flex w-auto flex-col space-y-2 p-2">
				<Select
					onValueChange={value =>
						dateField.onChange(addDays(new Date(), parseInt(value)))
					}>
					<SelectTrigger>
						<SelectValue placeholder="Select" />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value="0">Today</SelectItem>
						<SelectItem value="-1">Yesterday</SelectItem>
						<SelectItem value="1">Tommorrow</SelectItem>
					</SelectContent>
				</Select>
				<div className="rounded-md border">
					<Calendar
						mode="single"
						selected={dateField.value}
						onSelect={dateField.onChange}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}

function Entry({ index, control }: { index: number; control: Control }) {
	const [entries, setEntry] = useRecoilState(entryAtom);
	const removeEntry = (index: number) => {
		setEntry(entry => entry.toSpliced(index, 1));
	};
	const uuid = entries[index];
	const { field: amountField } = useController({
		name: uuid.concat(".amount"),
		control,
		defaultValue: "",
	});
	const { field: messageField } = useController({
		name: uuid.concat(".message"),
		control,
		defaultValue: "",
	});

	return (
		<div className="flex flex-wrap gap-2">
			<Input
				placeholder="Amount"
				type="number"
				className="w-fit max-sm:w-[96px]"
				{...amountField}
			/>
			<DatePicker index={index} control={control} />
			<Input
				placeholder="Message"
				className="w-fit"
				type="text"
				{...messageField}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={() => removeEntry(index)}>
				<IconX stroke={2} size={16} />
			</Button>
		</div>
	);
}

type EntryFormRef = { submit: () => void };

function EntryForm({ formRef }: { formRef: React.Ref<EntryFormRef | null> }) {
	const { user } = useUser();

	const queryClient = useQueryClient();
	const entryMutation = useMutation({
		mutationFn: entriesMutationFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			queryClient.refetchQueries({ queryKey: ["entries"] });
		},
	});

	const [entries, setEntry] = useRecoilState(entryAtom);
	const { control, handleSubmit } = useForm();
	const onSubmit = (e: FieldValues) => {
		let data: any[] = [];
		entries.forEach(entry => data.push(e[entry]));

		if (!user) {
			return;
		}

		const entriesData: Prisma.EntryCreateManyInput[] = data.map(value => ({
			amount: Number(value.amount),
			date: value.date,
			message: value.message,
			user_id: user.id,
		}));
		entryMutation.mutate(entriesData);
	};

	useLayoutEffect(() => {
		setEntry(() => [nanoid()]);
	}, []);

	useImperativeHandle(formRef, () => ({
		submit() {
			handleSubmit(onSubmit)();
		},
	}));

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full px-4">
			<div className="space-y-4">
				<div className="flex flex-col gap-4">
					{entries.map((_, index) => (
						<React.Fragment key={index}>
							<Entry index={index} control={control} />
							<Separator
								orientation="horizontal"
								className="bg-input/50 lg:hidden"
							/>
						</React.Fragment>
					))}
				</div>
				<Button
					variant="secondary"
					type="button"
					onClick={() => setEntry(value => [...value, nanoid()])}>
					+ Add More
				</Button>
			</div>
		</form>
	);
}

export function CreateEntryDialog() {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const entryFormRef = useRef<EntryFormRef>(null);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button>Create new</Button>
				</DialogTrigger>
				<DialogContent className="min-w-auto max-w-[72%]">
					<DialogHeader>
						<DialogTitle>Create new entry</DialogTitle>
						<DialogDescription>
							You can add mutliple entries at once.
						</DialogDescription>
					</DialogHeader>
					<EntryForm formRef={entryFormRef} />

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="ghost">
								Cancel
							</Button>
						</DialogClose>
						<Button
							onClick={() => {
								entryFormRef?.current?.submit();
								setOpen(false);
							}}
							type="submit">
							Create
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button>Create new</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create new entry</DrawerTitle>
					<DrawerDescription>
						You can add mutliple entries at once.
					</DrawerDescription>
				</DrawerHeader>

				<EntryForm formRef={entryFormRef} />

				<DrawerFooter>
					<DrawerClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DrawerClose>
					<Button
						onClick={() => {
							entryFormRef?.current?.submit();
							setOpen(false);
						}}
						type="submit">
						Create
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
