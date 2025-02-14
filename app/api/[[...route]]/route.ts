import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { apiKeys as apiKeysRouter } from "@/server/api-keys";
import { categories as categoriesRouter } from "@/server/categories";
import { entries as entriesRouter } from "@/server/entries";
import { tags as tagsRouter } from "@/server/tags";
import { users as usersRouter } from "@/server/users";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const apiAuthMiddleware = createMiddleware(async (ctx, next) => {
	const url = new URL(ctx.req.url);
	const allowed =
		process.env.APP_URL !== undefined &&
		url.origin === new URL(process.env.APP_URL).origin;
	if (allowed) {
		return await next();
	}
	const token = ctx.req.header("x-authorization");
	if (typeof token === "string") {
		if (token === process.env.MASTER_API_KEY) {
			return await next();
		}
		const result = await prisma.apiKey.findUnique({
			where: { key: token },
		});
		if (result) return await next();
	}
	throw new HTTPException(422, { message: "Unauthorized" });
});

const cacheMiddleware = createMiddleware(async (ctx, next) => {
	const ignored = ["/ping"];
	const isignored = ignored.some(x => x == ctx.req.path);
	const shouldcache = !isignored && ctx.req.method === "GET";
	const shouldinvalidate = !isignored && ctx.req.method !== "get";

	const key = `__api_${ctx.req.path}`;

	if (shouldinvalidate) redis.del(key);

	if (!shouldcache) return next();

	if ((await redis.exists(key)) === 0) {
		const oldjsonfn = ctx.json;
		ctx.json = ((obj, arg, headers) => {
			redis.set(key, JSON.stringify(obj), "EX", 30, err => {
				if (!err) {
					console.log(`[api] cache hit ${key}`);
					if (headers === undefined) {
						headers = { ["x-cache-status"]: "hit" };
						return;
					}
					headers["x-cache-status"] = "hit";
				} else console.log(err);
			});
			return oldjsonfn(obj, arg, headers);
		}) as typeof oldjsonfn;
		return next();
	}

	const obj = await redis.get(key);
	if (obj == null) return next();
	return ctx.json(JSON.parse(obj), { status: 200 });
});

//app.use("*", apiAuthMiddleware);
app.use("*", cacheMiddleware);

app.get("/ping", ctx => ctx.json({ success: true }));

app.route("/entries", entriesRouter);
app.route("/users", usersRouter);
app.route("/tags", tagsRouter);
app.route("/categories", categoriesRouter);
app.route("/api-keys", apiKeysRouter);
app.route("/settings");

app.onError((err, ctx) => {
	if (err instanceof HTTPException) return err.getResponse();
	else if (err instanceof PrismaClientKnownRequestError) {
		switch (err.code) {
			case "P2002":
				return new HTTPException(409).getResponse();
		}
	}
	console.log(err);
	return new HTTPException(400).getResponse();
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
