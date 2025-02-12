/**
 * CATEGORY HANDLERS
 * documentation: docs/api/categories
 */

import prisma from "@/lib/prisma";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createCategorySchema, editCategorySchema } from "./schema";

export const categories = new Hono();

categories.get("/:id", async ctx => {
	const { id } = ctx.req.param();
	const result = await prisma.category.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			created_at: true,
			updated_at: true,
			entries: false,
			user: false,
			user_id: false,
			_count: true,
		},
	});
	if (!result) {
		throw new HTTPException(404);
	}
	return ctx.json(result, { status: 200 });
});

categories.post("/", async ctx => {
	const payload = createCategorySchema.safeParse(await ctx.req.json());
	if (!payload.success) {
		throw new HTTPException(422);
	}
	const { name, user_id } = payload.data;
	await prisma.category.create({
		data: { name, user_id },
	});
	return ctx.json({}, { status: 200 });
});

// Updates a single category
categories.put("/:id", async ctx => {
	const { id } = ctx.req.param();
	const payload = editCategorySchema.safeParse(await ctx.req.json());
	if (!payload.success) {
		throw new HTTPException(422);
	}
	const { name } = payload.data;
	await prisma.category.update({
		where: { id },
		data: { name },
	});
});

categories.delete("/:id", async ctx => {
	const { id } = ctx.req.param();
	await prisma.category.delete({ where: { id } });
	return ctx.json(null, { status: 200 });
});
