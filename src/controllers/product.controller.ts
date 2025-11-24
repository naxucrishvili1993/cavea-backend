import { Request, Response } from "express";
import logger from "../config/logger";
import {
	createProduct as createProductService,
	deleteProduct as deleteProductService,
	findAllProducts,
	findProductById,
	findProductsByLocation,
	updateProduct as updateProductService,
} from "../services/product.service";
import { formatValidationError } from "../utils/format";
import { createProductSchema, updateProductSchema } from "../validations";

export async function createProduct(req: Request, res: Response) {
	try {
		const validationResult = createProductSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: "Validation failed",
				details: formatValidationError(validationResult.error),
			});
		}

		const { name, description, price, locationId } = validationResult.data;

		const product = await createProductService({
			name,
			locationId,
			description,
			price,
		});

		res.status(201).json({
			message: "Product created successfully",
			product: {
				id: product.id,
				name: product.name,
				description: product.description,
				price: product.price,
				locationId: product.locationId,
			},
		});
	} catch (e) {
		logger.error("Error in createProduct controller", e);
		res
			.status(500)
			.json({ message: "Could not create product - " + (e as Error).message });
	}
}

export async function getAllProducts(req: Request, res: Response) {
	try {
		const products = await findAllProducts();
		res.status(200).json({
			message: "Products retrieved successfully",
			products: products.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				price: p.price,
				// Location address
				location: p.location ? p.location.address : null,
			})),
		});
	} catch (e) {
		logger.error("Error in getAllProducts controller", e);
		res.status(500).json({ message: "Could not retrieve products" });
	}
}

export async function getProductById(req: Request, res: Response) {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "Product ID is required" });
		}
		const product = await findProductById(Number(id));
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.status(200).json({
			message: "Product retrieved successfully",
			product: {
				id: product.id,
				name: product.name,
				description: product.description,
				price: product.price,
				location: product.location ? product.location.address : null,
			},
		});
	} catch (e) {
		logger.error("Error in getProductById controller", e);
		res.status(500).json({ message: "Could not retrieve product" });
	}
}

export async function getProductsByLocationId(req: Request, res: Response) {
	try {
		const { locationId } = req.params;

		if (!locationId) {
			return res.status(400).json({ message: "Location ID is required" });
		}

		const products = await findProductsByLocation(Number(locationId));

		res.status(200).json({
			message: "Products retrieved successfully",
			products: products.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				price: p.price,
			})),
		});
	} catch (e) {
		logger.error("Error in getProductsByLocationId controller", e);
		res.status(500).json({ message: "Could not retrieve products" });
	}
}

export async function updateProduct(req: Request, res: Response) {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		const validationResult = updateProductSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: "Validation failed",
				details: formatValidationError(validationResult.error),
			});
		}

		const { name, description, price, locationId } = validationResult.data;

		const updatedProduct = await updateProductService(Number(id), {
			name,
			description,
			price,
			locationId,
		});

		res.status(200).json({
			message: "Product updated successfully",
			product: {
				id: updatedProduct.id,
				name: updatedProduct.name,
				description: updatedProduct.description,
				price: updatedProduct.price,
				locationId: updatedProduct.locationId,
			},
		});
	} catch (e) {
		logger.error("Error in updateProduct controller", e);
		res.status(500).json({ message: "Could not update product" });
	}
}

export async function deleteProduct(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		await deleteProductService(Number(id));

		res.status(200).json({ message: "Product deleted successfully" });
	} catch (e) {
		logger.error("Error in deleteProduct controller", e);
		res.status(500).json({ message: "Could not delete product" });
	}
}
