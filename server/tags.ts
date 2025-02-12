/**
 * TAG HANDLERS
 * documentation: docs/api/tags
 */

import prisma from "@/lib/prisma";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createTagSchema, editTagSchema } from "./schema";

export const tags = new Hono();

tags.get("/:id", async ctx => {
	const { id } = ctx.req.param();
	const result = await prisma.tag.findUnique({
		where: { id },
		select: {
			_count: true,
			entries: false,
			id: true,
			name: true,
			user: false,
			user_id: true,
		},
	});
	if (!result) throw new HTTPException(404);
	return ctx.json(result, { status: 200 });
});

tags.post("/", async ctx => {
	const payload = createTagSchema.safeParse(await ctx.req.json());
	if (!payload.success) {
		throw new HTTPException(422);
	}
	const { name, user_id } = payload.data;
	await prisma.tag.create({
		data: { name, user_id },
	});
	return ctx.json({}, { status: 200 });
});

tags.put("/:id", async ctx => {
	const { id } = ctx.req.param();
	const payload = editTagSchema.safeParse(await ctx.req.json());
	if (!payload.success) {
		throw new HTTPException(422);
	}
	const { name } = payload.data;
	await prisma.tag.update({
		where: { id },
		data: { name },
	});
});

tags.delete("/:id", async ctx => {
	const { id } = ctx.req.param();
	await prisma.tag.delete({ where: { id } });
	return ctx.json({}, { status: 200 });
});
