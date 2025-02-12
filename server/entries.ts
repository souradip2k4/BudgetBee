/**
 * ENTRIES HANDLERS
 * documentation: docs/api/entries
 */
import prisma from "@/lib/prisma";
import { run } from "@/lib/utils";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	createEntrySchema,
	deleteEntrySchema,
	editEntrySchema,
} from "./schema";

export const entries = new Hono();

entries.get("/:id", async ctx => {
	const { id } = ctx.req.param();
	const result = await prisma.entry.findUnique({
		where: { id },
		select: {
			amount: true,
			date: true,
			user: false,
			tags: {
				select: {
					user: false,
					entries: false,
					id: true,
					name: true,
				},
			},
			category: {
				select: {
					entries: false,
					created_at: true,
					id: true,
					name: true,
					updated_at: true,
				},
			},
			category_id: true,
		},
	});
	if (!result) {
		throw new HTTPException(404, { message: "No such entry found" });
	}
	// removing implementation specific details like Prisma.Decimal
	const modifiedResult = {
		...result,
		amount: result.amount.toNumber(),
		date: result.date.toJSON(),
	};
	return ctx.json(modifiedResult, { status: 200 });
});

// Creates new expenses. Takes in array of expenses

entries.post("/", async ctx => {
	const payload = createEntrySchema.safeParse(await ctx.req.json());
	if (!payload.success) {
		throw new HTTPException(422);
	}
	const { category_id, date, ...rest } = payload.data;
	prisma.entry.create({
		data: { ...rest, date: new Date(date), category_id },
	});
});

// Updates a single entry
entries.put("/:id", async ctx => {
	const { id } = ctx.req.param();
	const payload = editEntrySchema.safeParse(await ctx.req.json());
	if (!payload.success) {
		throw new HTTPException(422);
	}
	const { amount, category_id, tag_ids, message } = payload.data;
	const category = run(category_id, id => ({ connect: { id } }));
	const tags = run(tag_ids, ids => ({ connect: ids.map(id => ({ id })) }));
	prisma.entry.update({
		where: { id },
		data: { amount, message, category, tags },
	});
});

entries.delete("/", async ctx => {
	const payload = deleteEntrySchema.safeParse(await ctx.req.json());
	if (!payload.success) {
		throw new HTTPException(422);
	}
	const result = await prisma.entry.deleteMany({
		where: { id: { in: payload.data.ids } },
	});
	return ctx.json(result, { status: 200 });
});
entries.delete("/:id", async ctx => {
	const { id } = ctx.req.param();
	await prisma.entry.delete({ where: { id } });
	return ctx.json(null, { status: 200 });
});
