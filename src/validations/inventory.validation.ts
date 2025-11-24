import z from "zod";
import { generateZodErrorString } from "./utils";

export const createInventorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(8, generateZodErrorString("Inventory name", 8, 100).min)
		.max(100, generateZodErrorString("Inventory name", 8, 100).max),
	description: z
		.string()
		.trim()
		.min(10, generateZodErrorString("Inventory description", 10, 255).min)
		.max(255, generateZodErrorString("Inventory description", 10, 255).max),
	price: z.number().min(0, "Price must be a positive number"),
	locationId: z.number(),
});

export const updateInventorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(8, generateZodErrorString("Inventory name", 8, 100).min)
		.max(100, generateZodErrorString("Inventory name", 8, 100).max)
		.optional(),
	description: z
		.string()
		.trim()
		.min(10, generateZodErrorString("Inventory description", 10, 255).min)
		.max(255, generateZodErrorString("Inventory description", 10, 255).max)
		.optional(),
	price: z.number().min(0, "Price must be a positive number").optional(),
	locationId: z.number().optional(),
});
