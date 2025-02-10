"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QueryCategories } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Pencil, X } from "lucide-react";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { H3 } from "../ui/typography";

export default function Category() {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const categoriesQuery = useQuery<unknown, unknown, QueryCategories>({
		queryKey: ["category", user?.id],
		queryFn: async () => {
			if (!user?.id) return null;
			const res = await axios.get(`/api/users/${user?.id}/categories`);
			return res.data as QueryCategories;
		},
	});

	const createCategoriesMutation = useMutation<
		unknown,
		unknown,
		{ name: string | undefined }
	>({
		mutationKey: ["category", user?.id, "new"],
		mutationFn: async variables => {
			if (!user?.id) return null;
			try {
				const res = await axios.post(`/api/categories`, {
					name: variables.name,
					user_id: user.id,
				});
				return res.data;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.response?.status === 409) {
						// TODO: show toast here
						alert("Can't create categories with the same name.");
					}
				}
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["category", user?.id],
			});
			queryClient.refetchQueries({ queryKey: ["category", user?.id] });
		},
	});

	const deleteCategoriesMutation = useMutation<
		unknown,
		unknown,
		{ id?: string }
	>({
		mutationKey: ["category", user?.id, "new"],
		mutationFn: async variables => {
			if (!user?.id) return null;
			try {
				const res = await axios.delete(
					`/api/categories/${variables.id}`,
				);
				return res.data;
			} catch (error) {
				if (error instanceof AxiosError) {
				}
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["category", user?.id],
			});
			queryClient.refetchQueries({ queryKey: ["category", user?.id] });
		},
	});

	const { handleSubmit, register } = useForm();

	const onSubmit = async (e: FieldValues) => {
		if (!user?.id) return;
		await createCategoriesMutation.mutateAsync({ name: e.name });
	};

	return (
		<div>
			<div className="space-y-4">
				<H3 className="mt-0">Categories</H3>
				{categoriesQuery.isLoading && <p>Loading</p>}
				{!categoriesQuery.isLoading && (
					<div className="flex gap-4">
						{categoriesQuery.data?.map(value => (
							<React.Fragment key={value.id}>
								<div className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
									<p>{value.name}</p>
									<p className="text-xs text-muted-foreground">
										{"(100 entries)"}
									</p>
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className="size-6 p-0">
												<Pencil className="h-4 w-4" />
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>
													Edit category
												</DialogTitle>
												<DialogDescription>
													Make changes to your profile
													here. Click save when
													you&apos;re done.
												</DialogDescription>
											</DialogHeader>
											{/** TODO: EDIT THIS */}
											{/* <form onSubmit={handleSubmit(onSubmit)}>
                                                <Label htmlFor="name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input
                                                    placeholder="category"
                                                    {...register("name", { required: true })}
                                                />
                                                <Button type="submit">Create</Button>
                                            </form> */}
										</DialogContent>
									</Dialog>
									<Button
										variant="outline"
										className="size-6 p-0"
										onClick={() => {
											deleteCategoriesMutation.mutate({
												id: value.id,
											});
										}}>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</React.Fragment>
						))}
					</div>
				)}
				<div>
					<Dialog>
						<DialogTrigger asChild>
							<Button>New category</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Create new category</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click
									save when you&apos;re done.
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									placeholder="category"
									{...register("name", { required: true })}
								/>
								<Button type="submit">Create</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}
