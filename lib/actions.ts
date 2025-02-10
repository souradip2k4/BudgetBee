"use server";

import { Prisma } from "@prisma/client";
import prisma from "./prisma";

export const entriesMutationFn = async (
	data: Prisma.EntryCreateManyInput[],
) => {
	return prisma.entry.createMany({ data });
};

export type EditEntryMutationFnParams = {
	id: string;
	amount: number | null;
	message: string | null;
	category_id: string | null;
	date?: Date;
};

export const editEntryMutationFn = async ({
	id,
	amount,
	message,
	category_id,
	date,
}: EditEntryMutationFnParams) => {
	if (category_id === null) {
		return prisma.entry.update({
			where: { id },
			data: { amount: amount?.toString(), message, date },
		});
	}
	return prisma.entry.update({
		where: { id },
		data: {
			amount: amount?.toString(),
			message,
			date,
			category: { connect: { id: category_id } },
		},
	});
};
