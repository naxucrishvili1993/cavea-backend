import z from "zod";
import { generateZodErrorString } from "./utils";

export const createLocationSchema = z.object({
	address: z
		.string()
		.trim()
		.min(5, generateZodErrorString("Location address", 5, 50).min)
		.max(50, generateZodErrorString("Location address", 5, 50).max),
});

export const updateLocationSchema = z.object({
	address: z
		.string()
		.trim()
		.min(5, generateZodErrorString("Location address", 5, 50).min)
		.max(50, generateZodErrorString("Location address", 5, 50).max)
		.optional(),
});
