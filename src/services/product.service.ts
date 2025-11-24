import { ValidationError } from "sequelize";
import logger from "../config/logger";
import { Product } from "../models/product.model";

export async function createProduct({
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
		const product = await Product.create({
			name,
			locationId,
			description,
			price,
		});
		return product;
	} catch (e) {
		if (e instanceof ValidationError) {
			if (
				e.errors
					.map((err) => err.message)
					.join(", ")
					.includes("must be unique")
			) {
				logger.error("Duplicate product name error", e);
				throw new Error("Product name must be unique");
			}
		}
		logger.error("Error creating product", e);
		throw new Error("Could not create product");
	}
}

export async function findProductById(id: number) {
	try {
		const product = await Product.findByPk(id, { include: ["location"] });
		return product;
	} catch (e) {
		logger.error("Error fetching product by ID", e);
		throw new Error("Could not fetch product");
	}
}

export async function findAllProducts() {
	try {
		const products = await Product.findAll({ include: ["location"] });
		return products;
	} catch (e) {
		logger.error("Error fetching all products", e);
		throw new Error("Could not fetch products");
	}
}

export async function updateProduct(
	id: number,
	updates: Partial<{
		name: string;
		locationId: number;
		description: string;
		price: number;
	}>
) {
	try {
		const product = await Product.findByPk(id);
		if (!product) {
			throw new Error("Product not found");
		}

		await product.update(updates);
		return product;
	} catch (e) {
		logger.error("Error updating product", e);
		throw new Error("Could not update product");
	}
}

export async function deleteProduct(id: number) {
	try {
		const product = await Product.findByPk(id);
		if (!product) {
			throw new Error("Product not found");
		}
		await product.destroy();
		return true;
	} catch (e) {
		logger.error("Error deleting product", e);
		throw new Error("Could not delete product");
	}
}

export async function findProductsByLocation(locationId: number) {
	try {
		const products = await Product.findAll({
			where: { locationId },
			include: ["location"],
		});
		return products;
	} catch (e) {
		logger.error("Error fetching products by location", e);
		throw new Error("Could not fetch products by location");
	}
}
