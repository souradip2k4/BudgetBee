import axios, { AxiosError } from "axios";
import { beforeEach } from "node:test";
import { describe, expect, it } from "vitest";
import { _testonly_clearcache } from "./testutils";

const url = (path: string) => {
	const base = new URL("http://localhost:3000");
	return new URL(path, base).toString();
};

const apiUrl = (path: string) => {
	const base = new URL("http://localhost:3000");
	return new URL(`/api${path}`, base).toString();
};

describe("health check /ping", () => {
	it("should return status ok", async () => {
		const result = await axios.get(url("/api/ping"));
		expect(result.data).toEqual({ success: true });
	});
});

describe("testing /users route", () => {
	it("unauthenticated clients cannot create new users", async () => {
		await expect(async () => {
			await axios.post(apiUrl("/users"), {});
		}).rejects.toThrowError(AxiosError);
	});

	it.todo("non-admin clients cannot create new users");

	it.todo("should create user", () => {});
	it.todo("should modify user");
	it.todo("should get user");
	it.todo("should not get user");
	it.todo("should delete user");

	it.todo("should create multiple entries");
	it.todo("should create multiple categories");
	it.todo("should create multiple tags");
	it.todo("should create multiple apikeys");
});

describe("testing /entries route", () => {});

describe("testing cache behaviour", () => {
	beforeEach(() => _testonly_clearcache());

	it("second request should hit cache", async () => {
		const _res = await axios.get(apiUrl("/ping"));
		const nextres = await axios.get(apiUrl("/ping"));
		expect(nextres.headers["X-CACHE-STATUS"]).toBe("HIT");
	});
});
