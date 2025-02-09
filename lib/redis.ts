import { Redis } from "ioredis";

if (!process.env.REDIS_URL)
	throw new Error("Please provide REDIS_URL env variable");
export const redis = new Redis(process.env.REDIS_URL);
