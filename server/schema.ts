import { z } from "zod";

/**
 * ENTRY SCHEMAS
 */
export const createEntrySchema = z.object({
	user_id: z.string(),
	amount: z.number(),
	message: z.string(),
	category_id: z.string().optional(),
	date: z.string(),
});

export const editEntrySchema = z.object({
	amount: z.number().optional(),
	message: z.string().optional(),
	category_id: z.string().optional(),
	tag_ids: z.array(z.string()).optional(),
});

export const deleteEntrySchema = z.object({ ids: z.array(z.string()) });

/**
 * TAGS SCHEMA
 */
export const createTagSchema = z.object({
	name: z.string(),
	user_id: z.string(),
});

export const editTagSchema = z.object({
	name: z.string().optional(),
});

/**
 * CATEGORY SCHEMA
 */
export const createCategorySchema = z.object({
	name: z.string(),
	user_id: z.string(),
});

export const editCategorySchema = z.object({
	name: z.string().optional(),
});
