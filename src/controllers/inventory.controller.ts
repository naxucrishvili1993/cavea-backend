import { Request, Response } from "express";
import logger from "../config/logger";
import {
	createInventory as createInventoryService,
	updateInventory as updateInventoryService,
	deleteInventory as deleteInventoryService,
	findAllInventories,
	findInventoryById,
} from "../services/inventory.service";
import { formatValidationError } from "../utils/format";
import { createInventorySchema, updateInventorySchema } from "../validations";
import { Inventory } from "../models/inventory.model";

export async function createInventory(req: Request, res: Response) {
	try {
		const validationResult = createInventorySchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: "Validation failed",
				details: formatValidationError(validationResult.error),
			});
		}

		const { name, description, price, locationId } = validationResult.data;

		const inventory = await createInventoryService({
			name,
			locationId,
			description,
			price,
		});

		res.status(201).json({
			message: "Inventory created successfully",
			inventory: {
				id: inventory.id,
				name: inventory.name,
				description: inventory.description,
				price: inventory.price,
				locationId: inventory.locationId,
			},
		});
	} catch (e) {
		logger.error("Error in createInventory controller", e);
		res.status(500).json({
			message: "Could not create inventory - " + (e as Error).message,
		});
	}
}

export async function getAllInventories(req: Request, res: Response) {
	try {
		const { page, locationId, sortBy = "name", order = "ASC" } = req.query;
		const inventories = await findAllInventories({
			page: Number(page) || 1,
			locationId: locationId ? Number(locationId) : undefined,
			sortBy: sortBy as "name" | "description" | "location",
			order: order as "ASC" | "DESC",
		});
		res.status(200).json({
			message: "Inventories retrieved successfully",
			inventories: inventories.inventories.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				price: p.price,
				location: p.location ? p.location.address : null,
				locationId: p.locationId,
			})),
			total: inventories.total,
		});
	} catch (e) {
		logger.error("Error in getAllInventories controller", e);
		res.status(500).json({ message: "Could not retrieve inventories" });
	}
}

export async function getInventoryById(req: Request, res: Response) {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "Inventory ID is required" });
		}
		const inventory = await findInventoryById(Number(id));
		if (!inventory) {
			return res.status(404).json({ message: "Inventory not found" });
		}

		res.status(200).json({
			message: "Inventory retrieved successfully",
			inventory: {
				id: inventory.id,
				name: inventory.name,
				description: inventory.description,
				price: inventory.price,
				location: inventory.location ? inventory.location.address : null,
			},
		});
	} catch (e) {
		logger.error("Error in getInventoryById controller", e);
		res.status(500).json({ message: "Could not retrieve inventory" });
	}
}

export async function updateInventory(req: Request, res: Response) {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "Inventory ID is required" });
		}

		const validationResult = updateInventorySchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: "Validation failed",
				details: formatValidationError(validationResult.error),
			});
		}

		const { name, description, price, locationId } = validationResult.data;

		const updatedInventory = await updateInventoryService(Number(id), {
			name,
			description,
			price,
			locationId,
		});

		res.status(200).json({
			message: "Inventory updated successfully",
			Inventory: {
				id: updatedInventory.id,
				name: updatedInventory.name,
				description: updatedInventory.description,
				price: updatedInventory.price,
				locationId: updatedInventory.locationId,
			},
		});
	} catch (e) {
		logger.error("Error in updateInventory controller", e);
		res.status(500).json({ message: "Could not update inventory" });
	}
}

export async function deleteInventory(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Inventory ID is required" });
		}

		await deleteInventoryService(Number(id));

		res.status(200).json({ message: "Inventory deleted successfully" });
	} catch (e) {
		logger.error("Error in deleteInventory controller", e);
		res.status(500).json({ message: "Could not delete inventory" });
	}
}

export async function bulkCreateInventories() {
	try {
		const rows = [];
		const locationIds = [2, 3, 4, 5, 6];

		const NUM_OF_PRODUCTS = 50_000;

		for (let i = 1; i <= NUM_OF_PRODUCTS; i++) {
			rows.push({
				name: `Item ${i}`,
				description: `Description for item ${i}`,
				price: Number((Math.random() * 100 + 1).toFixed(2)),
				locationId: locationIds[Math.floor(Math.random() * locationIds.length)],
			});
		}

		console.log("📦 Inserting inventories...");
		await Inventory.bulkCreate(rows, {
			validate: true,
			ignoreDuplicates: false,
		});

		console.log(`✅ Successfully inserted ${NUM_OF_PRODUCTS} inventory rows.`);
	} catch (err: any) {
		console.error("❌ Failed:", err.message);
	}
}
