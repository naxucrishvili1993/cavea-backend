import { ValidationError } from "sequelize";
import logger from "../config/logger";
import { Inventory } from "../models/inventory.model";

type InventoryFilters = {
	page?: number;
	limit?: number;
	sortBy?: "name" | "description" | "location";
	order?: "ASC" | "DESC";
	locationId?: number;
};

export async function createInventory({
	name,
	locationId,
	description,
	price,
}: {
	name: string;
	locationId: number;
	description: string;
	price: number;
}) {
	try {
		const inventory = await Inventory.create({
			name,
			locationId,
			description,
			price,
		});
		return inventory;
	} catch (e) {
		if (e instanceof ValidationError) {
			if (
				e.errors
					.map((err) => err.message)
					.join(", ")
					.includes("must be unique")
			) {
				logger.error("Duplicate inventory name error", e);
				throw new Error("Inventory name must be unique");
			}
		}
		logger.error("Error creating inventory", e);
		throw new Error("Could not create inventory");
	}
}

export async function findInventoryById(id: number) {
	try {
		const inventory = await Inventory.findByPk(id, { include: ["location"] });
		return inventory;
	} catch (e) {
		logger.error("Error fetching inventory by ID", e);
		throw new Error("Could not fetch inventory");
	}
}

export async function findAllInventories({
	page = 1,
	limit = 20,
	sortBy = "name",
	order = "ASC",
	locationId = undefined,
}: InventoryFilters) {
	try {
		const { rows, count } = await Inventory.findAndCountAll({
			where: locationId ? { locationId } : undefined,
			include: ["location"],
			offset: (page - 1) * limit,
			limit,
			order: [[sortBy, order]],
		});
		return { inventories: rows, total: count };
	} catch (e) {
		logger.error("Error fetching all inventories", e);
		throw new Error("Could not fetch inventories");
	}
}

export async function updateInventory(
	id: number,
	updates: Partial<{
		name: string;
		locationId: number;
		description: string;
		price: number;
	}>
) {
	try {
		const inventory = await Inventory.findByPk(id);
		if (!inventory) {
			throw new Error("Inventory not found");
		}

		await inventory.update(updates);
		return inventory;
	} catch (e) {
		logger.error("Error updating inventory", e);
		throw new Error("Could not update inventory");
	}
}

export async function deleteInventory(id: number) {
	try {
		const inventory = await Inventory.findByPk(id);
		if (!inventory) {
			throw new Error("Inventory not found");
		}
		await inventory.destroy();
		return true;
	} catch (e) {
		logger.error("Error deleting inventory", e);
		throw new Error("Could not delete inventory");
	}
}
