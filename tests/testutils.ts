import { redis } from "@/lib/redis";

export async function _testonly_clearcache() {
	if (process.env.NODE_ENV === "production") return;
	const keys = await redis.keys("__api_*");
	if (keys.length > 0) {
		await redis.del(keys);
	}
}
