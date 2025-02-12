/**
 * API KEYS HANDLERS
 * documentation: docs/api/api-keys
 */
import prisma from "@/lib/prisma";
import { addDays } from "date-fns";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const apiKeys = new Hono();

apiKeys.get("/:key", async ctx => {
	const { key } = ctx.req.param();
	const apiKey = await prisma.apiKey.findUnique({ where: { key } });
	if (!apiKey) {
		throw new HTTPException(404, { message: "no api key found" });
	}
	return ctx.json(apiKey, { status: 200 });
});

apiKeys.post("/:user_id", async ctx => {
	const { user_id } = ctx.req.param();
	const apiKey = await prisma.apiKey.create({
		data: { user_id, expire_at: addDays(new Date(), 30) },
	});
	return ctx.json(apiKey, { status: 200 });
});

apiKeys.delete("/:key", async ctx => {
	const { key } = ctx.req.param();
	await prisma.apiKey.delete({ where: { key } });
	return ctx.json({}, { status: 200 });
});
